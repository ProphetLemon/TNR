const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definir el esquema de carta
const cardSchema = new Schema({
  rareza: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
});

// Crear el modelo de carta
const Carta = mongoose.model("Carta", cardSchema);

// Exportar el modelo
module.exports = Carta;
