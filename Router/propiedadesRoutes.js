import express from "express";
import { body } from "express-validator";
const router = express.Router();
import protegerRuta from "../middleware/rutasProtegidas.js";
import upload from "../middleware/subirImagen.js";

// Importar controladores
import {
  cargarPropiedades,
  mostrarPropiedades,
  cargarCategoriasYPrecios,
  formularioPropiedad,
  validarDatosPropiedad,
  crearPropiedad,
  validarPropiedadExiste,
  validarPropiedadNoPubblicada,
  validarPropiedadDueño,
  mostrarFormularioImagenPropiedad,
  guardarImagen,
  eliminarPropiedad,
  formularioEditarPropiedad,
  validarDatosEditarPropiedad,
  editarPropiedad,
  //*-*-*-*-*-*-*-*-*-*-*-*-*-*
  mostrarPropiedad,
} from "../Controllers/propiedadesController.js";

//Rutas
router.get("/propiedades",
  protegerRuta,
  cargarPropiedades,
  mostrarPropiedades);
router.get(
  "/propiedades/crear",
  protegerRuta,
  cargarCategoriasYPrecios,
  formularioPropiedad
);
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
  validarDatosPropiedad,
  crearPropiedad
);
router.get(
  "/propiedades/agregarImagen/:id",
  protegerRuta,
  validarPropiedadExiste,
  validarPropiedadNoPubblicada,
  validarPropiedadDueño,
  mostrarFormularioImagenPropiedad
);
router.post(
  "/propiedades/agregarImagen/:id",
  protegerRuta,
  upload.single("imagen"),
  validarPropiedadExiste,
  validarPropiedadNoPubblicada,
  validarPropiedadDueño,
  guardarImagen
);

//Rutas
//Eliminar //!Hay Que crear estos controladores
router.post(
  "/propiedades/eliminarPropiedad/:id",
  protegerRuta,
  validarPropiedadExiste,
  validarPropiedadDueño,
  eliminarPropiedad
);
//Editar
router.get(
  "/propiedades/editarPropiedad/:id",
  protegerRuta,
  validarPropiedadExiste,
  validarPropiedadDueño,
  formularioEditarPropiedad
);
router.post(
  "/propiedades/editarPropiedad/:id",
  protegerRuta,
  body("titulo", "El título no puede estar vacío").notEmpty(),
  body("descripcion", "La descripción no puede estar vacía").notEmpty(),
  body("categoriaId", "La categoría es obligatoria").notEmpty(),
  body("precioId", "El precio es obligatorio").notEmpty(),
  body("habitaciones", "El número de habitaciones es obligatorio").notEmpty(),
  body("parqueos", "El número de parqueos es obligatorio").notEmpty(),
  body("banos", "El número de baños no puede estar vacío").notEmpty(),
  body("calle", "Ubica la propiedad en el mapa.").notEmpty(),
  validarDatosEditarPropiedad,
  validarPropiedadExiste,
  validarPropiedadDueño,
  editarPropiedad
);

// Rutas que van a ser publicas
router.get("/propiedades/:id", mostrarPropiedad);

//Exportar rutas
export default router;
