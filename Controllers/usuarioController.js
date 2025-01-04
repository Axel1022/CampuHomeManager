import { check, validationResult } from "express-validator";
import { generarJWT, generarId } from "../helpers/tokens.js";
import bcrypt from "bcrypt";
import { emailRegistro, emailRestablecerContrasena } from "../helpers/email.js";
import Usuario from "../Models/Usuario.js";

//Formulario para iniciar sesion
const formularioLogin = async (req, res) => {
  res.status(401).render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

//Validar credenciales
const validarUsuario = async (req, res) => {
  //Validando que sea una contrasena y correo valido
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
  try {
    const { correo, contrasena } = req.body;

    //Verificando si el usuario existe
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

    //Verifico que el usuario activo su cuenta
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

    //Verificando la contraseña
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
    //Autenticar usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });
    //Guardando token en la cookie
    return res
      .cookie("_token", token, {
        httpOnly: true,
      })
      .redirect("/propiedades");
  } catch (error) {
    console.error("Error durante el proceso de autenticación:", error);
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

//Formulario para registrar usuarios
const formularioRegistro = async (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    // csrfToken: req.csrfToken(), Esto no me funciona, xd
  });
};

// Validaciones antes de registrar al usuario
const validarRegistro = async (req, res, next) => {
  //Validaciones
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
  const usuario = await Usuario.create({
    nombre: req.body.nombre,
    email: req.body.correo,
    password: req.body.contrasena,
    token: generarId(),
    confirmado: false,
  });

  //! DECOMENTAR AQUI
  // // Enviar correo de activación
  // emailRegistro({
  //   nombre: usuario.nombre,
  //   email: usuario.email,
  //   token: usuario.token,
  // });

  res.render("templatess/mensaje", {
    pagina: "Registro Exitoso",
    mensaje:
      "Tu cuenta ha sido creada exitosamente. Revisa tu correo para activar tu cuenta.",
    url: "/auth/login",
    titulo: "Ir al Inicio de Sesión",
  });
};

// Actualizar el estado del usuario y eliminar el token
const confirmarUsuario = async (req, res) => {
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
  //Eliminar el token y confirmado como true
  usuario.token = null;
  usuario.confirmado = true;

  // await Usuario.update(
  //   { token: "", confirmado: true },
  //   { where: { token } }
  // );

  await usuario.save();

  res.render("auth/confirmarCuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "Cuenta activada corectamente",
    titulo: "Ir al Inicio",
    error: false,
  });
};

//Formulario para colocar el correo
const formularioVerificarCorreo = async (req, res) => {
  res.render("auth/olvidePass", {
    pagina: "Recuperar acceso a Bienes Raices",
  });
};

//Validaciones antes de enviar correo al usuario con el link para cambiar contrasena
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
  validarUsuario,
  formularioRegistro,
  formularioVerificarCorreo,
  validarPass,
  validarRegistro,
  confirmarUsuario,
  FormularioNuevaPass,
  validarNuevaPass,
};
