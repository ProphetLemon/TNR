const express = require("express");
const router = express.Router();
const User = require("../models/user");
const utils = require("../utils");

router.get("/", async (req, res) => {
  const token = req.cookies.iamtoken;
  if (!token) {
    res.redirect("/login");
  }
  var user = await User.findOne({ token: token });
  if (!user) {
    res.redirect("/login");
  }

  // Ejemplo de listado de cartas con diferentes rarezas
  const cards = [
    { name: "Carta 1", rarity: "normal" },
    { name: "Carta 2", rarity: "rara" },
    { name: "Carta 3", rarity: "super-rara" },
    { name: "Carta 4", rarity: "legendaria" },
    { name: "Carta 5", rarity: "normal" },
    { name: "Carta 6", rarity: "rara" },
    { name: "Carta 7", rarity: "rara" },
    { name: "Carta 8", rarity: "rara" },
    { name: "Carta 9", rarity: "rara" },
    { name: "Carta 10", rarity: "rara" },
  ];

  res.render("album", { usuario: utils.crearProyeccion(user), cards });
});

module.exports = router;
