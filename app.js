import express from "express";
import usuarioRoutes from "./Router/usuarioRoutes.js";
import proiedadesRoutes from "./Router/propiedadesRoutes.js";
import NotFund from "./Controllers/404Controller.js";
import cookieParser from "cookie-parser";

const app = express();

// Configuración
app.set("view engine", "pug");
app.set("views", "./Views");
app.use(cookieParser());
app.use(express.static("public"));

// Middleware para analizar JSON
app.use(express.json());

// Middleware para analizar datos codificados
app.use(express.urlencoded({ extended: true }));

// Middleware - Rutas
app.use("/auth", usuarioRoutes);
app.use("/", proiedadesRoutes);
app.use("/", NotFund);

export default app;
