import { check, validationResult } from "express-validator";
import { generarJWT, generarId } from "../helpers/tokens.js";
import bcrypt from "bcrypt";
import { emailRegistro, emailRestablecerContrasena } from "../helpers/email.js";
import Usuario from "../Models/Usuario.js";

//TODO: Formulario para iniciar sesion
const formularioLogin = async (req, res, next) => {
  res.status(401).render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

//TODO: Autenticar usuario

// 1: Valida campos del formulario
const validarCamposFormularioLogin = async (req, res, next) => {
  await check("correo", "Debe ser un correo válido.").isEmail().run(req);
  await check("contrasena", "La contraseña debe tener al menos 8 caracteres.")
    .isLength({ min: 8 })
    .run(req);
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.status(400).render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: resultado.array(),
      usuario: {
        correo: req.body.correo,
      },
    });
  }
  next();
};

// 2: Verifica que el usuario exista
const usuarioLegitimo = async (req, res, next) => {
  const { correo } = req.body;
  try {
    const usuario = await Usuario.findOne({
      where: { email: correo },
    });

    if (!usuario) {
      return res.status(400).render("auth/login", {
        pagina: "Iniciar Sesión",
        errores: [
          {
            msg: "No existe una cuenta con ese correo electrónico. Por favor, revisa el correo o regístrate si no tienes una cuenta.",
          },
        ],
        usuario: {
          correo: req.body.correo,
        },
      });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(500).render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: [
        {
          msg: "Hubo un problema al procesar tu solicitud. Intenta nuevamente más tarde.",
        },
      ],
      usuario: { correo: req.body.correo },
    });
  }
};

// 3: Validar si el usuario esta activo
const usuarioActivo = async (req, res, next) => {
  try {
    const usuario = req.usuario;
    if (!usuario.confirmado) {
      return res.status(403).render("auth/login", {
        pagina: "Iniciar Sesión",
        errores: [
          {
            msg: "Tu cuenta no ha sido activada. Revisa tu correo electrónico para activar tu cuenta. Si no lo encuentras, revisa en la carpeta de spam.",
          },
        ],
        usuario: {
          correo: req.body.correo,
        },
      });
    }
    next();
  } catch (error) {
    res.status(500).render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: [
        {
          msg: "Hubo un problema al procesar tu solicitud. Intenta nuevamente más tarde.",
        },
      ],
      usuario: { correo: req.body.correo },
    });
  }
};

// 4: Verificar la contraseña
const verificarContrasena = async (req, res, next) => {
  try {
    const { contrasena } = req.body;
    const usuario = req.usuario;

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.password);
    if (!contrasenaValida) {
      return res.status(400).render("auth/login", {
        pagina: "Iniciar Sesión",
        errores: [
          {
            msg: "La contraseña ingresada es incorrecta. Por favor, inténtalo de nuevo.",
          },
        ],
        usuario: {
          correo: req.body.correo,
        },
      });
    }

    next();
  } catch (error) {
    res.status(500).render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: [
        {
          msg: "Hubo un problema al procesar tu solicitud. Intenta nuevamente más tarde.",
        },
      ],
      usuario: { correo: req.body.correo },
    });
  }
};

// 5: Autenticar usuario
const autenticarUsuario = async (req, res, next) => {
  const usuario = req.usuario;
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

  return res
    .cookie("_token", token, {
      httpOnly: true,
    })
    .redirect("/propiedades");
};

//TODO: Formulario para registrar usuarios
const formularioRegistro = async (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

//TODO: Crear cuenta de usuario

// 1: Validar campos del formulario
const validarFormularioRegistro = async (req, res, next) => {
  await check("nombre", "El nombre es obligatorio.").notEmpty().run(req);
  await check("correo", "Debe ser un correo válido.").isEmail().run(req);
  await check("contrasena", "La contraseña debe tener al menos 8 caracteres.")
    .isLength({ min: 8 })
    .run(req);
  await check("Ccontrasena", "Las contraseñas deben coincidir.")
    .custom((value, { req }) => value === req.body.contrasena)
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        Ccontrasena: req.body.Ccontrasena,
      },
    });
  }
  console.log("Validacion de campos correcta");
  next();
};

// 2: Validar si el correo ya existe
const usuarioExistente = async (req, res, next) => {
  const existeEmail = await Usuario.findOne({
    where: { email: req.body.correo },
  });
  if (existeEmail) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "Este correo ya está en uso." }],
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo,
      },
    });
  }
  console.log("Usuario no existe");
  next();
};

// 3: Crear usuario
const crearUsuario = async (req, res, next) => {
  const usuario = await Usuario.create({
    nombre: req.body.nombre,
    email: req.body.correo,
    password: req.body.contrasena,
    token: generarId(),
    confirmado: false,
  });
  req.usuario = usuario;
  console.log("Usuario creado");
  next();
};

// 4: Enviar correo de activación
const enviarCorreo = async (req, res, next) => {
  const usuario = req.usuario;
  // ! DECOMENTAR AQUI
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });
  console.log("Correo enviado");
  next();
};

// 5: Mensaje de exito
const redireccionarMensajeExito = async (req, res) => {
  res.render("templatess/mensaje", {
    pagina: "Registro Exitoso",
    mensaje:
      "Tu cuenta ha sido creada exitosamente. Revisa tu correo para activar tu cuenta.",
    url: "/auth/login",
    titulo: "Ir al Inicio de Sesión",
  });
};

//TODO: Activar usaurio

//1: Validar token
const validarToken = async (req, res, next) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmarCuenta", {
      pagina: "Error al confirmar cuenta",
      mensaje: "El token de activación es inválido o ha expirado.",
      titulo: "Ir al Inicio",
      error: true,
    });
  }
  req.usuario = usuario;

  console.log("Token validado");
  next();
};

//2:  Remover token
const eliminarToken = async (req, res, next) => {
  const usuario = req.usuario;
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  next();
};

//3: Mensaje confirmar cuenta
const confirmarCuenta = async (req, res) => {
  res.render("auth/confirmarCuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "Cuenta activada corectamente",
    titulo: "Ir al Inicio",
    error: false,
  });
};

//TODO: Formulario olvide contraseña
const formularioVerificarCorreo = async (req, res) => {
  res.render("auth/olvidePass", {
    pagina: "Recuperar acceso a Bienes Raices",
  });
};

//TODO: Enviar las instruciones para cambiar contraseña

// 1: Validar correo
const validarPass = async (req, res) => {
  await check("correo", "El correo es obligatorio.").notEmpty().run(req);
  await check("correo", "Debe ser un correo válido.").isEmail().run(req);
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/olvidePass", {
      pagina: "Recuperar acceso a Bienes Raices",
      errores: resultado.array(),
      usuario: {
        correo: req.body.correo,
      },
    });
  }

  // Verifico si el usuario existe
  const usuario = await Usuario.findOne({
    where: { email: req.body.correo },
  });

  if (!usuario) {
    return res.render("auth/olvidePass", {
      pagina: "Recuperar acceso a Bienes Raices",
      errores: [{ msg: "No encontramos una cuentra asociada a este correo." }],
      usuario: {
        correo: req.body.correo,
      },
    });
  }
  usuario.token = generarId();
  usuario.save();

  //! DECOMENTAR AQUI

  // // Enviar correo
  // emailRestablecerContrasena({
  //   email: usuario.email,
  //   token: usuario.token,
  //   nombre: usuario.nombre,
  // });

  res.render("templatess/mensaje", {
    pagina: "Solicitud Exitosa",
    mensaje:
      "Hemos enviado un correo con las instrucciones para cambiar tu contraseña. Por favor, revisa tu bandeja de entrada.",
    url: "/auth/login",
    titulo: "Ir al Inicio de Sesión",
  });
};

//Formulario para colocar la nueva contrasena (requiere un token válido)
const FormularioNuevaPass = async (req, res) => {
  const { token } = req.params;

  // Primero verifico que el token sea válido.
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("templatess/mensaje", {
      pagina: "Token Inválido o Expirado",
      mensaje:
        "El enlace para cambiar tu contraseña es inválido o ha expirado. Por favor, solicita un nuevo enlace.",
      url: "/auth/olvide-pass",
      titulo: "Solicitar Nuevo Enlace",
    });
  }
  //Formulario para colocar la nueva password
  res.render("auth/cambiarPass", {
    pagina: "Cambiar Contraseña",
    usuario: usuario.email,
  });
};

// Validaciones antes de cambiar la contrasena
const validarNuevaPass = async (req, res) => {
  await check("contrasena", "La contraseña debe tener al menos 8 caracteres.")
    .isLength({ min: 8 })
    .run(req);
  await check("Ccontrasena", "Las contraseñas deben coincidir.")
    .custom((value, { req }) => value === req.body.contrasena)
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/cambiarPass", {
      pagina: "Cambiar Contraseña",
      errores: resultado.array(),
    });
  }
  const { token } = req.params;
  const { contrasena } = req.body;

  // Actualizar la contraseña del usuario y eliminar token
  const usuario = await Usuario.findOne({ where: { token } });

  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(contrasena, salt);
  usuario.token = null;
  await usuario.save();

  res.render("templatess/mensaje", {
    pagina: "Contraseña Actualizada",
    mensaje:
      "Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
    url: "/auth/login",
    titulo: "Ir al Inicio de Sesión",
  });
};

export {
  formularioLogin,
  validarCamposFormularioLogin,
  usuarioLegitimo,
  usuarioActivo,
  verificarContrasena,
  autenticarUsuario,
  formularioRegistro,
  validarFormularioRegistro,
  usuarioExistente,
  crearUsuario,
  enviarCorreo,
  redireccionarMensajeExito,
  validarToken,
  eliminarToken,
  confirmarCuenta,
  //-------------------------
  formularioVerificarCorreo,
  validarPass,

  FormularioNuevaPass,
  validarNuevaPass,
};
