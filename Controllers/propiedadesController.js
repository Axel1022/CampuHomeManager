import { validationResult } from "express-validator";
import { obtenerCategoriasYPrecios } from "../helpers/obtnerCategoriasyPrecios.js";
import { Propiedad } from "../Models/Relaciones.js";
import { Categoria, Precio } from "../Models/Relaciones.js";
import { unlink } from "node:fs/promises"; //Para eliminar la imagen

//TODO: Muestras las propiedades en el home

// 1: Cargar propiedades
const cargarPropiedades = async (req, res, next) => {
  const { id } = req.usuario;

  //Paso 2: Buscar sus propiedades

  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id,
    },
    include: [
      {
        model: Categoria,
        as: "categoria",
      },
      {
        model: Precio,
        as: "precio",
      },
    ],
  });

  //Paso 3: Mapear las propiedades

  const propiedadesMap = propiedades.map(({ dataValues }) => dataValues);

  req.propiedades = propiedadesMap;

  next();
};

// 2: Mostrar propiedades
const mostrarPropiedades = (req, res, next) => {
  const { propiedades } = req;
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    hasPropiedades: true,
    propiedades,
  });
};

//TODO: Formulario Crear Propiedad

// 1: Cargar categorias y precios
const cargarCategoriasYPrecios = async (req, res, next) => {
  try {
    const { categoriasMap, preciosMap } = await obtenerCategoriasYPrecios();
    req.categorias = categoriasMap;
    req.precios = preciosMap;
  } catch (error) {
    console.log(error);
  }
  next();
};

// 2: Mostrar formulario Crear Propiedad
const formularioPropiedad = async (req, res) => {
  try {
    const { categorias, precios } = req;
    res.render("propiedades/crearPropiedad", {
      pagina: "Crear Propiedad",
      Categorias: categorias,
      Precios: precios,
      datos: {},
    });
  } catch (error) {
    console.log(error);
  }
};

//TODO: Crear Propiedades

// 1: Validar datos del formulario
const validarDatosPropiedad = async (req, res, next) => {
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
  console.log("Datos validados");
  next();
};

// 2: Crear propiedad
const crearPropiedad = async (req, res, next) => {
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
  } catch (error) {
    console.log(error);
  }
};

//TODO: Mostar formulario para la imaden de la propiedad

// 1: Validar que exista la pripiedad
const validarPropiedadExiste = async (req, res, next) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  try {
    if (!propiedad) {
      //Si no existe la propiedad
      //Lo mandamos al home de propiedades
      return res.redirect("/propiedades");
    }
  } catch (error) {
    console.log(error);
  }
  req.propiedad = propiedad;
  next();
};

// 2: //Validar que la propiedad no este publicada
const validarPropiedadNoPubblicada = async (req, res, next) => {
  const { propiedad } = req;
  if (propiedad.publicado) {
    //Si la propiedad esta publicada
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }
  next();
};

// 3: validar el dueño de la propiedad
const validarPropiedadDueño = async (req, res, next) => {
  const { propiedad } = req;
  if (req.usuario.id !== propiedad.usuarioId) {
    // Si el usuario no es el dueño de la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }
  next();
};

// 4: Mostar formulario para agregar la imagen
const mostrarFormularioImagenPropiedad = async (req, res) => {
  const { propiedad } = req;
  res.render("propiedades/agregarImagen", {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    propiedad,
  });
};

//TODO: Guardar imagen
// 1: Validar que exista la pripiedad (reutilizada)

// 2: //Validar que la propiedad no este publicada (reutilizada)

// 3: validar el dueño de la propiedad (reutilizada)

// 4: Guardar imagen
const guardarImagen = async (req, res, next) => {
  const { propiedad } = req;
  try {
    //Aqui guardo la imagen en la base de datos (ubicacion de la imagen)

    propiedad.imagen = req.file.filename;
    propiedad.publicado = true;
    await propiedad.save();

    //Dopzone redirige a las propiedades

    res.redirect("/propiedades");
  } catch (error) {
    console.log(error);
  }
};

//TODO: Eliminar propiedad

// 1: Validar que exista la pripiedad (reutilizada)

// 2: validar el dueño de la propiedad (reutilizada)`

// 3: Eliminar propiedad
const eliminarPropiedad = async (req, res) => {
  const { propiedad } = req;
  await unlink(`public/uploads/${propiedad.imagen}`); //Eliminamos la imagen
  await propiedad.destroy();
  res.redirect("/propiedades");
};

//TODO: Formulario para editar la propiedad

// 1: Validar que exista la pripiedad (reutilizada)

// 2: validar el dueño de la propiedad (reutilizada)`

// 3: Mostrar formulario para editar la propiedad
const formularioEditarPropiedad = async (req, res) => {
  const { propiedad } = req;
  const { categoriasMap, preciosMap } = await obtenerCategoriasYPrecios();
  // Mostrar el formulario
  res.render("propiedades/editarPropiedad", {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    Categorias: categoriasMap,
    Precios: preciosMap,
    datos: propiedad,
  });
};

//TODO: Editar propieeda

// 1: Validar los datos del formulario
const validarDatosEditarPropiedad = async (req, res, next) => {
  const validaciones = validationResult(req);
  if (!validaciones.isEmpty()) {
    const errores = validaciones.array();
    const { categoriasMap, preciosMap } = await obtenerCategoriasYPrecios();
    //Si hay errores
    return res.render("propiedades/editarPropiedad", {
      pagina: `Editar Propiedad`,
      Categorias: categoriasMap,
      Precios: preciosMap,
      datos: req.body,
      errores,
    });
  }
  next();
};
// 2: Validar que exista la pripiedad (reutilizada)

// 3: validar el dueño de la propiedad (reutilizada)`
const editarPropiedad = async (req, res) => {
  const { propiedad } = req;
  //Reescribir propiedad
  try {
    const {
      titulo,
      descripcion,
      habitaciones,
      parqueos,
      banos,
      calle,
      lat,
      lng,
      categoriaId,
      precioId,
    } = req.body;
    // Actualizamos los datos de la propiedad
    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      parqueos,
      banos,
      calle,
      lat,
      lng,
      categoriaId,
      precioId,
    });
    // Guardamos los cambios en la base de datos
    await propiedad.save();
    res.redirect("/propiedades");
  } catch (error) {
    console.log(error);
  }
};

const mostrarPropiedad = (req, res, next) => {
  res.render("propiedades/mostrarPropiedad", {
    pagina: "Mostrar Propiedad",
  });
};
export {
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
  //-------------------------------------
  mostrarPropiedad,
};
