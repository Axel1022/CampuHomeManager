/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  // 18.476522,-69.9362786 // Se obtienen de google map\r\n  const lat =document.querySelector(\"#lat\").value ||  18.476522;\r\n  const lng = document.querySelector(\"#lng\").value || -69.9362786;\r\n  const mapa = L.map(\"mapa\").setView([lat, lng], 13);\r\n  let marker; //Pin\r\n\r\n  //Porvider y Geocoder\r\n  const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n\r\n  //Pin\r\n  marker = new L.marker([lat, lng], {\r\n    draggable: true, //Para poder moverlo\r\n    autoPan: true, // Para que se pueda mover el mapa, xd\r\n  }).addTo(mapa); //Se le agrega a la instancia del mapa\r\n\r\n  //Obtener posicion del pin\r\n  marker.on(\"moveend\", function (event) {\r\n    //DEtectamos cuando se mueva el pin\r\n    marker = event.target;\r\n    const posicion = marker.getLatLng(); //Obtenemos la nueva posicion del pin\r\n    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)); //Centramos el mapa\r\n\r\n    //Informacion de la calle\r\n    geocodeService\r\n      .reverse()\r\n      .latlng(posicion, 13)\r\n      .run(function (error, resultado) {\r\n        console.log(resultado);\r\n        marker.bindPopup(resultado.address.LongLabel); //Muestra info al tocarl el pon\r\n\r\n        //LLenar los campos del formulario\r\n        //Campo visible\r\n        document.querySelector(\".calle\").textContent =\r\n          resultado?.address?.Match_addr ?? \"\";\r\n\r\n        //Campo invisibles\r\n        document.querySelector(\"#calle\").value = resultado?.address?.Match_addr;\r\n        document.querySelector(\"#lat\").value = resultado?.latlng?.lat;\r\n        document.querySelector(\"#lng\").value = resultado?.latlng?.lng;\r\n      });\r\n  });\r\n})();\r\n\n\n//# sourceURL=webpack://campukey/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;