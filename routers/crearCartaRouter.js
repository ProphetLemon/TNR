const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const User = require("../models/user");
const multer = require("multer");
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

let gfs;
let storage;

mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");

  // Configurar GridFS Storage
  storage = new GridFsStorage({
    db: mongoose.connection.db,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = Date.now() + "-" + file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads", // Nombre del bucket donde se almacenarán los archivos
        };
        resolve(fileInfo);
      });
    },
  });
});

const upload = multer({ storage });

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
