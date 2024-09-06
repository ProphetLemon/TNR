const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definir el esquema de carta
const cardSchema = new Schema({
  rareza: {
    type: String,
    required: true,
    enum: ["normal", "rara", "super-rara", "legendaria"], // Validación para los valores de rareza
  },
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  imagen: {
    type: Buffer, // Almacena el ID del archivo en GridFS
    required: true,
  },
  audio: {
    type: Buffer, // Almacena el ID del archivo en GridFS
    required: true,
  },
});

const Carta = mongoose.model("Carta", cardSchema);

module.exports = Carta;
