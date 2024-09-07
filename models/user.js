const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const Carta = require("./carta").schema;

// Definir el esquema de usuario
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio."],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        // Verificar que no haya espacios en blanco o caracteres de control
        return /^[^\s\u200E\u200F\u202A-\u202E]*$/.test(v);
      },
      message: "El nombre de usuario no debe contener espacios en blanco ni caracteres invisibles.",
    },
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
    validate: {
      validator: function (v) {
        // Verificar que la contraseña no tenga espacios en blanco ni caracteres de control
        return /^[^\s\u200E\u200F\u202A-\u202E]*$/.test(v);
      },
      message: "La contraseña no debe contener espacios en blanco ni caracteres invisibles.",
    },
  },
  token: {
    type: String,
    default: generateUUID, // Establece el token por defecto usando la función generateUUID
    unique: true,
  },
  tiradas: {
    type: Number,
    default: 0, // Inicializa los puntos en 0
  },
  cartas: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para "sanitize" (hash) la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Genera un UUID (Universally Unique Identifier) versión 4.
 * Un UUID v4 es un identificador único de 128 bits que se representa como una cadena de 36 caracteres, incluyendo cuatro guiones.
 *
 * @returns {string} Un UUID v4 en formato 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
 */
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Método para comparar contraseñas durante el login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Crear el modelo de usuario
const User = mongoose.model("User", userSchema);

// Exportar el modelo
module.exports = User;
