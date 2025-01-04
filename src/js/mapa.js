(function () {
  // 18.476522,-69.9362786 // Se obtienen de google map
  const lat =document.querySelector("#lat").value ||  18.476522;
  const lng = document.querySelector("#lng").value || -69.9362786;
  const mapa = L.map("mapa").setView([lat, lng], 13);
  let marker; //Pin

  //Porvider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //Pin
  marker = new L.marker([lat, lng], {
    draggable: true, //Para poder moverlo
    autoPan: true, // Para que se pueda mover el mapa, xd
  }).addTo(mapa); //Se le agrega a la instancia del mapa

  //Obtener posicion del pin
  marker.on("moveend", function (event) {
    //DEtectamos cuando se mueva el pin
    marker = event.target;
    const posicion = marker.getLatLng(); //Obtenemos la nueva posicion del pin
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)); //Centramos el mapa

    //Informacion de la calle
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, resultado) {
        console.log(resultado);
        marker.bindPopup(resultado.address.LongLabel); //Muestra info al tocarl el pon

        //LLenar los campos del formulario
        //Campo visible
        document.querySelector(".calle").textContent =
          resultado?.address?.Match_addr ?? "";

        //Campo invisibles
        document.querySelector("#calle").value = resultado?.address?.Match_addr;
        document.querySelector("#lat").value = resultado?.latlng?.lat;
        document.querySelector("#lng").value = resultado?.latlng?.lng;
      });
  });
})();
