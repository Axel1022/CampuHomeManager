import express from "express";
import { body } from "express-validator";
const router = express.Router();
import protegerRuta from "../middleware/rutasProtegidas.js";
import upload from "../middleware/subirImagen.js";

// Importar controladores
import {
  homePropiedades,
  formularioPropiedades,
  crearPropiedad,
  agregarImagen,
  agregarImagenPost,
} from "../Controllers/propiedadesController.js";

//Rutas
router.get("/propiedades", protegerRuta, homePropiedades);
router.get("/propiedades/crear", protegerRuta, formularioPropiedades);
router.post(
  "/propiedades/crear",
  protegerRuta,
  body("titulo", "El título no puede estar vacío").notEmpty(),
  body("descripcion", "La descripción no puede estar vacía").notEmpty(),
  body("categoria", "La categoría es obligatoria").notEmpty(),
  body("precio", "El precio es obligatorio").notEmpty(),
  body("habitaciones", "El número de habitaciones es obligatorio").notEmpty(),
  body("parqueos", "El número de parqueos es obligatorio").notEmpty(),
  body("banos", "El número de baños no puede estar vacío").notEmpty(),
  body("calle", "Ubica la propiedad en el mapa.").notEmpty(),
  crearPropiedad
);
router.get("/propiedades/agregarImagen/:id", protegerRuta, agregarImagen);
router.post(
  "/propiedades/agregarImagen/:id",
  protegerRuta,
  upload.single("imagen"),
  agregarImagenPost
);

//Exportar rutas
export default router;
