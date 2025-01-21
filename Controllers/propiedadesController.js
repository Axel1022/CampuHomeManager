import { validationResult } from "express-validator";
import { obtenerCategoriasYPrecios } from "../helpers/obtnerCategoriasyPrecios.js";
import { Propiedad } from "../Models/Relaciones.js";
import { Categoria, Precio } from "../Models/Relaciones.js";
import { unlink } from "node:fs/promises"; //Para eliminar la imagen

//TODO: Muestras las propiedades en el home
const homePropiedades = async (req, res) => {
  //Paso 1: Buscar el id del usuario loggeado
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

  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    hasPropiedades: true,
    propiedadesMap,
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
  if (req.usuario.id !== propiedad.usuarioId) {
    // Si el usuario no es el dueño de la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }

  res.render("propiedades/agregarImagen", {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    propiedad,
  });
};

const agregarImagenPost = async (req, res, next) => {
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
  if (req.usuario.id !== propiedad.usuarioId) {
    // Si el usuario no es el dueño de la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }

  try {
    //Aqui guardo la imagen en la base de datos (ubicacion de la imagen)

    console.log(req.file);

    propiedad.imagen = req.file.filename;
    propiedad.publicado = true;
    await propiedad.save();

    //Dopzone redirige a las propiedades

    next();
  } catch (error) {
    console.log(error);
  }
};

const eliminarPropiedad = async (req, res) => {
  //ide de la propiedad
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    //Si no existe la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }

  //validar el dueño de la propiedad
  if (req.usuario.id !== propiedad.usuarioId) {
    // Si el usuario no es el dueño de la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }
  await unlink(`public/uploads/${propiedad.imagen}`); //Eliminamos la imagen
  await propiedad.destroy();
  res.redirect("/propiedades");
};
const editarPropiedad = async (req, res) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    //Si no existe la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }

  //validar el dueño de la propiedad
  if (req.usuario.id !== propiedad.usuarioId) {
    // Si el usuario no es el dueño de la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }

  const { categoriasMap, preciosMap } = await obtenerCategoriasYPrecios();
  // Mostrar el formulario
  res.render("propiedades/editarPropiedad", {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    Categorias: categoriasMap,
    Precios: preciosMap,
    datos: propiedad,
  });
};
const editarPropiedadPost = async (req, res) => {
  //Validamos los errores
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
  //Ontenermos el id la propiedad
  //Verificamos que exista
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    //Si no existe la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }

  //validar el dueño de la propiedad
  if (req.usuario.id !== propiedad.usuarioId) {
    // Si el usuario no es el dueño de la propiedad
    //Lo mandamos al home de propiedades
    return res.redirect("/propiedades");
  }
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
const cambiarEstadoPropiedad = async (req, res) => {};

export {
  homePropiedades,
  formularioPropiedades,
  crearPropiedad,
  agregarImagen,
  agregarImagenPost,
  eliminarPropiedad,
  editarPropiedad,
  editarPropiedadPost,
  cambiarEstadoPropiedad,
};
