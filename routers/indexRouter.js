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
        // Detiene la ejecución aquí si las tiradas son insuficientes
      }

      // Restar las tiradas y guardar el usuario
      user.tiradas -= tiradas;
      var user = await user.save();

      var cartas = await Carta.find();
      var cartasElegidas = [];
      for (let i = 0; i < tiradas; i++) {
        cartasElegidas.push(cartas[Math.floor(Math.random())]);
      }
      user.cartas.push(...cartasElegidas);
      await user.save();
      // Responder con un estado 200 de éxito
      return res.status(200).json({
        message: "Tirada realizada con éxito",
        cartas: cartasElegidas,
        type: "success",
      });
    } else {
      // Si no hay token en las cookies, darte error
      return res.status(401).json({
        message: `No estás logueado para hacer eso`,
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

module.exports = router;
