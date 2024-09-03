const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    if (req.cookies.iamtoken) {
      const token = req.cookies.iamtoken;
      const user = await User.findOne({ token: token });

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
      await user.save();

      // Responder con un estado 200 de éxito
      return res.status(200).json({
        message: "Tirada realizada con éxito",
        tiradasRestantes: user.tiradas,
        type: "success",
      });
    } else {
      // Si no hay token en las cookies, redirige al login
      return res.redirect("/login");
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
