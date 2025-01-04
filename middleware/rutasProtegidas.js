import jwt from "jsonwebtoken";
import { Usuario } from "../Models/Relaciones.js";
const protegerRuta = async (req, res, next) => {
  //Verificar si hay un token
  const { _token } = req.cookies;
  if (!_token) {
    return res.redirect("/auth/login");
  }
  //Validar el token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    const usuario = (await Usuario.scope("menosDatos").findByPk(decoded.id))
      .dataValues;

    //Poner el usuario al req
    if (!usuario) {
      req.usuario = usuario;
    }

    return next();
  } catch (error) {
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default protegerRuta;
