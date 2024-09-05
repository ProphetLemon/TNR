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
        // Si no existe, añade la carta con size inicial en 1
        map.set(carta.nombre, { ...carta.toObject(), size: 1 });
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
