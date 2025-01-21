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
  // ----------------------
  formularioVerificarCorreo,
  validarPass,

  confirmarUsuario,
  FormularioNuevaPass,
  validarNuevaPass,
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
  validarFormularioRegistro,
  usuarioExistente,
  crearUsuario,
  enviarCorreo,
  redireccionarMensajeExito
); 

// Confirmación de token para activar al usuario
router.get("/confirmar/:token", confirmarUsuario); // Confirmación de usuario mediante un token único

// Rutas para recuperar la contraseña
router.get("/olvide-pass", formularioVerificarCorreo); // Muestra el formulario para ingresar el correo del usuario
router.post("/olvide-pass", validarPass); // Si el correo existe, se envía el token al correo

// Rutas para cambiar la contraseña (requiere un token válido)
router.get("/cambiar-pass/:token", FormularioNuevaPass); // Muestra el formulario para cambiar la contraseña
router.post("/cambiar-pass/:token", validarNuevaPass); // Valida la nueva contraseña, y elimina el token para evitar reutilización

export default router;
