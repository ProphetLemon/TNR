const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");;
const User = require("../models/user");
const Carta = require("../models/carta");
const utils = require("../utils");

router.get("/", async (req, res) => {
  var token = req.cookies.iamtoken;
  if (!token) {
    return res.redirect("/login");
  }
  var user = await User.findOne({ token: token });
  if (!user) {
    return res.redirect("/login");
  }
  res.render("crear", { message: null, type: null });
});

router.post(
  "/",
  upload.fields([
    { name: "imagen", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Obtenemos el archivo guardado directamente desde multer-gridfs-storage
      const imagen = req.files["imagen"][0];
      const audio = req.files["audio"][0];

      if (!imagen || !audio) {
        return res.status(400).send("Error al subir los archivos");
      }

      // Crear la nueva carta con los datos enviados desde el formulario
      const nuevaCarta = new Carta({
        nombre: req.body.nombre,
        rareza: req.body.rareza,
        imagen: imagen.buffer, // Guardar el ID del archivo de imagen
        audio: audio.buffer, // Guardar el ID del archivo de audio
      });

      // Guardar la carta en la base de datos
      await nuevaCarta.save();

      res.render("crear", { message: "Carta creada con éxito", type: "success" });
    } catch (err) {
      console.error(err);
      res.render("crear", { message: "Error al crear la carta", type: "danger" });
    }
  }
);

module.exports = router;
