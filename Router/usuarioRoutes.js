import express from "express";
const router = express.Router();
import {
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
  validarFormulariocorreoPass,
  usuarioExistePass,
  asignarTokenPass,
  emailRestablecerpass,
  mensajeExitoPass,
  formularioVerificarCorreo,
  validarTokenPass,
  FormularioNuevaPass,
  FormularioConfirmarDatosPass,
  cambiarContrasena,
  confirmarNuevaPass,
} from "../Controllers/usuarioController.js";

//Login del usuario
router.get("/login", formularioLogin); // Formulario para el login
router.post(
  "/login",
  validarCamposFormularioLogin, //Valida que los campos no esten vacios
  usuarioLegitimo, //Valida que el usuario exista
  usuarioActivo, //Valida que el usuario este activo
  verificarContrasena, //Valida que la contraseña sea correcta
  autenticarUsuario // Autentica al usuario
);

// Registro de usuario
router.get("/registro", formularioRegistro); // Formulario para el registro de usuario
router.post(
  "/registro",
  validarFormularioRegistro, // Valida que los campos no estén vacíos
  usuarioExistente, // Valida que el usuario no exista
  crearUsuario, // Crea el usuario
  enviarCorreo, // Envia el correo de creacion
  redireccionarMensajeExito // Mensaje de confirmacion de creacion
);

// Confirmación de token para activar al usuario
router.get(
  "/confirmar/:token",
  validarToken, // Valida el token
  eliminarToken, // Elimina el token
  confirmarCuenta //Mensaje de confirmaciion de activacion
);

// Rutas para recuperar la contraseña
router.get("/olvide-pass", formularioVerificarCorreo); // Muestra el formulario para ingresar el correo del usuario
router.post(
  "/olvide-pass",
  validarFormulariocorreoPass, //Valida que los campos no esten vacios
  usuarioExistePass, // Verifica que exista la contraseña
  asignarTokenPass, // Coloca un token al usuario
  emailRestablecerpass, // Envia correo con las instrucciones
  mensajeExitoPass // Mensaje de exito
);

// Rutas para cambiar la contraseña (requiere un token válido)
router.get(
  "/cambiar-pass/:token",
  validarTokenPass, // Valida que los campos no esten vacios
  FormularioNuevaPass // Muesta el formulario de la contraseña
);
router.post(
  "/cambiar-pass/:token",
  FormularioConfirmarDatosPass, //Valida que los campos no esten vacios
  cambiarContrasena, // Cambiar contraseña
  confirmarNuevaPass // Mensaje de exito
);

export default router;
