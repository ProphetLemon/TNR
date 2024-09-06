const express = require("express");
const router = express.Router();
const User = require("../models/user");
const utils = require("../utils");

router.get("/", async (req, res) => {
  const token = req.cookies.iamtoken;

  // Si no hay token, redirigir inmediatamente
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const user = await User.findOne({ token: token });

    // Si no se encuentra el usuario, redirigir a login
    if (!user) {
      return res.redirect("/login");
    }

    const cartasMap = user.cartas.reduce((map, carta) => {
      // Si ya existe la carta en el mapa, incrementa el tamaño
      if (map.has(carta.nombre)) {
        map.get(carta.nombre).size += 1;
      } else {
        // Si no existe, convierte la imagen y el audio a Base64 y añade la carta con size inicial en 1
        let base64Imagen = null;
        let base64Audio = null;

        // Convertir ArrayBuffer a Buffer de Node.js y luego a Base64 para la imagen
        if (carta.imagen && carta.imagen.buffer) {
          const bufferImagen = Buffer.from(carta.imagen.buffer); // Convertir ArrayBuffer a Buffer
          const mimetypeImagen = carta.imagen.mimetype || "image/png"; // Definir un mimetype predeterminado si no existe
          base64Imagen = `data:${mimetypeImagen};base64,${bufferImagen.toString("base64")}`;
        }

        // Convertir ArrayBuffer a Buffer de Node.js y luego a Base64 para el audio
        if (carta.audio && carta.audio.buffer) {
          const bufferAudio = Buffer.from(carta.audio.buffer); // Convertir ArrayBuffer a Buffer
          const mimetypeAudio = carta.audio.mimetype || "audio/mpeg"; // Definir un mimetype predeterminado si no existe
          base64Audio = `data:${mimetypeAudio};base64,${bufferAudio.toString("base64")}`;
        }

        // Añadir la carta al mapa con las versiones en Base64 de la imagen y el audio
        map.set(carta.nombre, {
          ...carta.toObject(),
          imagenBase64: base64Imagen,
          audioBase64: base64Audio,
          size: 1,
        });
      }
      return map;
    }, new Map());

    const rarezaValores = {
      normal: 1,
      rara: 2,
      "super-rara": 3,
      legendaria: 4,
    };

    // Convertir el Map en un array de cartas
    const cartasAlbum = Array.from(cartasMap.values()).sort((a, b) => {
      return rarezaValores[a.rareza] - rarezaValores[b.rareza];
    });

    // Renderizar la vista con el usuario y las cartas
    res.render("album", { usuario: utils.crearProyeccion(user), cards: cartasAlbum });
  } catch (error) {
    // Manejo de errores, por ejemplo, conexión a la base de datos fallida
    console.error("Error al obtener el álbum del usuario:", error);
    res.status(500).send("Error al cargar el álbum");
  }
});

module.exports = router;
