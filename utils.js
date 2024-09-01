// utils.js
const user = require("./models/user");
/**
 * Obtiene la fecha y hora actuales en formato dd/MM/yyyy HH:mm:ss.
 * @returns {string} La fecha y hora actuales en formato dd/MM/yyyy HH:mm:ss.
 */
function getCurrentDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript van de 0 a 11.
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Genera un número aleatorio dentro de un rango dado.
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @returns {number} Un número aleatorio entre min y max, ambos inclusive.
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Capitaliza la primera letra de una cadena.
 * @param {string} string - La cadena que se va a capitalizar.
 * @returns {string} La cadena con la primera letra en mayúscula.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 *
 * @param {user} user
 */
function crearProyeccion(user) {
  return { username: user.username, points: user.points };
}

/**
 * Transforma horas en milisegundos
 * @param {number} horas Número de horas a transformar
 * @returns {number} Milisegundos de las horas dadas
 */
function horasEnMilisegundos(horas) {
  return horas * 60 * 60 * 1000;
}

// Exportar las funciones para que puedan ser utilizadas en otros archivos
module.exports = {
  getCurrentDateTime,
  getRandomNumber,
  crearProyeccion,
  capitalizeFirstLetter,
  horasEnMilisegundos,
};
