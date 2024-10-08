const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Carta = require("../models/carta");

router.post("/", async (req, res) => {
  try {
    if (req.cookies.iamtoken) {
      const token = req.cookies.iamtoken;
      var user = await User.findOne({ token: token });

      if (!user) {
        return res.redirect("/login"); // Si no se encuentra el usuario, redirige al login
      }

      const tiradas = parseInt(req.body.numTiradas); // Asegúrate de que sea un número

      if (tiradas > user.tiradas) {
        return res.status(400).json({
          message: `No tienes tantas tiradas (tienes ${user.tiradas} y has intentado tirar ${tiradas})`,
          type: "error",
        });
      }

      // Restar las tiradas y guardar el usuario
      user.tiradas -= tiradas;
      await user.save();

      var cartasElegidas = [];
      for (let i = 0; i < tiradas; i++) {
        var rareza = obtenerRareza();

        // Obtener solo el nombre de una carta aleatoria con la rareza correspondiente
        const resultadoCarta = await Carta.aggregate([
          { $match: { rareza: rareza } }, // Filtrar por rareza
          { $sample: { size: 1 } }, // Obtener una carta aleatoria
          {
            $project: {
              // Proyección para devolver solo el nombre
              nombre: 1,
              _id: 0,
            },
          },
        ]);

        if (resultadoCarta.length > 0) {
          const nombreCarta = resultadoCarta[0].nombre; // Obtener solo el nombre de la carta

          // Buscar si ya existe una carta con el mismo nombre en cartasElegidas
          const cartaDuplicada = cartasElegidas.find((carta) => carta.nombre === nombreCarta);

          let cartaElegida;
          if (cartaDuplicada) {
            // Duplicar la carta encontrada
            cartaElegida = { ...cartaDuplicada };
          } else {
            // Obtener la carta completa ya que no fue duplicada
            const cartaCompleta = await Carta.findOne({ nombre: nombreCarta, rareza: rareza });

            if (cartaCompleta) {
              // Convertir ArrayBuffer de imagen y audio a Base64 si existen
              let base64Imagen = null;
              let base64Audio = null;

              if (cartaCompleta.imagen && cartaCompleta.imagen.buffer) {
                const bufferImagen = Buffer.from(cartaCompleta.imagen.buffer); // Convertir ArrayBuffer a Buffer
                const mimetypeImagen = cartaCompleta.imagen.mimetype || "image/png"; // Definir un mimetype predeterminado si no existe
                base64Imagen = `data:${mimetypeImagen};base64,${bufferImagen.toString("base64")}`;
              }

              if (cartaCompleta.audio && cartaCompleta.audio.buffer) {
                const bufferAudio = Buffer.from(cartaCompleta.audio.buffer); // Convertir ArrayBuffer a Buffer
                const mimetypeAudio = cartaCompleta.audio.mimetype || "audio/mpeg"; // Definir un mimetype predeterminado si no existe
                base64Audio = `data:${mimetypeAudio};base64,${bufferAudio.toString("base64")}`;
              }

              // Añadir la carta con la imagen y el audio en Base64
              cartaElegida = {
                ...cartaCompleta.toObject(),
                imagenBase64: base64Imagen,
                audioBase64: base64Audio,
              };
            }
          }

          if (cartaElegida) {
            cartasElegidas.push(cartaElegida);
          }
        }
      }

      const nombresCartas = cartasElegidas.map((carta) => carta.nombre);
      user.cartas.push(...nombresCartas);
      await user.save();

      // Responder con éxito
      return res.status(200).json({
        message: "Tirada realizada con éxito",
        cartas: cartasElegidas,
        type: "success",
      });
    } else {
      return res.status(401).json({
        message: "No estás logueado para hacer eso",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error en la ruta /tiradas:", error);
    return res.status(500).json({
      message: "Ha ocurrido un error en el servidor",
      type: "error",
    });
  }
});

function obtenerRareza() {
  const aleatorio = Math.random();

  if (aleatorio < 0.7) {
    return "normal"; // 70% de probabilidad
  } else if (aleatorio < 0.9) {
    return "rara"; // 20% de probabilidad
  } else if (aleatorio < 0.999) {
    return "super-rara"; // 9.99% de probabilidad
  } else {
    return "legendaria"; // 0.01% de probabilidad
  }
}

module.exports = router;
