import { Dropzone } from "dropzone";

Dropzone.options.imagen = {
  dictDefaultMessage: "Arrastra tus imagenes aquí",
  acceptedFiles: ".png, .jpg, .jpge",
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  addRemoveLinks: true,
  dictRemoveFile: "Eliminar archivo",
  dictMaxFilesExceeded: "Solo puede subir un archivo",


};
