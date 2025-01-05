import { validationResult } from "express-validator";
import { obtenerCategoriasYPrecios } from "../helpers/obtnerCategoriasyPrecios.js";
import { Propiedad } from "../Models/Relaciones.js";

//TODO: Muestras las propiedades en el home
const homePropiedades = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
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
      Categorias: categoriasMap,
      Precios: preciosMap,
      errores,
      datos: req.body,
    });
  }
  //Paso 2: Crear propiedad

  const {
    titulo,
    descripcion,
    habitaciones,
    parqueos,
    banos,
    calle,
    lat,
    lng,
    categoria: categoriaId,
    precio: precioId,
  } = req.body;
  //categoria: categoria_id, //! Renombrando la variable, i love this, xd

  //Obtener el usuario que esta loggeado
  const { id: usuarioId } = req.usuario;

  //Creando la propiedad
  try {
    const propiedadCreada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      parqueos,
      banos,
      calle,
      lat,
      lng,
      imagen: "",
      usuarioId,
      categoriaId,
      precioId,
    });
    const { id } = propiedadCreada;
    res.redirect(`/propiedades/agregarImagen/${id}`);
  } catch (error) {}
};

//TODO: Agregar Imagen a la propiedad
const agregarImagen = async (req, res) => {
  //Validar que la propiedad exista
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    //Si no existe la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }

  //Validar que la propiedad no este publicada
  if (propiedad.publicado) {
    //Si la propiedad esta publicada
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }
  //validar el dueño de la propiedad

  console.log(req.usuario)

  res.render("propiedades/agregarImagen", {
    pagina: "Agregar Imagen",
  });
};

export {
  homePropiedades,
  formularioPropiedades,
  crearPropiedad,
  agregarImagen,
};
