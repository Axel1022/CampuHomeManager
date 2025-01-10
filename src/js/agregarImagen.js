import { Dropzone } from "dropzone";

Dropzone.options.imagen = {
  dictDefaultMessage: "Arrastra tus imagenes aquí",
  acceptedFiles: ".png, .jpg, .jpge",
  autoProcessQueue: false,
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  addRemoveLinks: true,
  dictRemoveFile: "Eliminar archivo",
  dictMaxFilesExceeded: "Solo puede subir un archivo",
  paramName: "imagen",
  init: function () {
    const dropzone = this;
    const btnPublicar = document.getElementById("publicar");
    btnPublicar.disabled = false;

    btnPublicar.addEventListener("click", function () {
      dropzone.processQueue();
    });

    dropzone.on("queuecomplete", function () {
      if (dropzone.getActiveFiles().length === 0) {
        window.location.href = "/propiedades";
      }
    });
  },
};
