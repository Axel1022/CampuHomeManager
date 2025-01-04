import { validationResult } from "express-validator";
import { obtenerCategoriasYPrecios } from "../helpers/obtnerCategoriasyPrecios.js";

//TODO: Muestras las propiedades en el home
const homePropiedades = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    navBar: true,
  });
};

//TODO: Mostrar formulario (Pasos: 2)
const formularioPropiedades = async (req, res) => {
  try {
    //Paso 1: Buscar Categorias y precios en la base de datos
    const { categoriasMap, preciosMap } = await obtenerCategoriasYPrecios();
    //Paso 3: Mostrar el formulario
    res.render("propiedades/crearPropiedad", {
      pagina: "Crear Propiedad",
      navBar: true,
      Categorias: categoriasMap,
      Precios: preciosMap,
      datos: {},
    });
  } catch (error) {
    console.log(error);
  }
};

//TODO: Crear Propiedades
const crearPropiedad = async (req, res) => {
  //Paso 1: Validar datos
  const validaciones = validationResult(req);
  if (!validaciones.isEmpty()) {
    const errores = validaciones.array();
    const { categoriasMap, preciosMap } = await obtenerCategoriasYPrecios();
    //Paso 3: Mostrar el formulario
    return res.render("propiedades/crearPropiedad", {
      pagina: "Crear Propiedad",
      navBar: true,
      Categorias: categoriasMap,
      Precios: preciosMap,
      errores,
      datos: req.body,
    });
  }
  //Paso 2: Crear propiedad
};

export { homePropiedades, formularioPropiedades, crearPropiedad };
