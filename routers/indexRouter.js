const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Asegúrate de que la ruta sea correcta según tu estructura de proyecto
const utils = require("../utils");

// Ruta para manejar GET en '/'
router.get("/", async (req, res) => {
  try {
    // Verificar si la cookie 'iamtoken' existe
    if (req.cookies.iamtoken) {
      // Buscar un usuario con el token correspondiente en la base de datos
      const user = await User.findOne({ token: req.cookies.iamtoken });

      if (user) {
        // Si el usuario es encontrado, renderizar la vista principal
        res.render("index", { usuario: utils.crearProyeccion(user) });
      } else {
        // Si no se encuentra un usuario con ese token, redirigir a login
        res.redirect("/login");
      }
    } else {
      // Si la cookie no existe, redirigir a la vista de login
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error al buscar el usuario por token:", error);
    res.redirect("/login");
  }
});

// Ruta para manejar GET en '/login'
router.get("/login", (req, res) => {
  res.render("login", { message: null, type: null });
});

// Ruta para manejar POST en '/login'
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        res.cookie("iamtoken", user.token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      } else {
        // Mostrar mensaje de error
        res.render("login", { message: "Credenciales inválidas. Inténtalo de nuevo.", type: "danger" });
      }
    } else {
      // Mostrar mensaje de error
      res.render("login", { message: "Usuario no encontrado. Inténtalo de nuevo.", type: "danger" });
    }
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    res.render("login", { message: "Error del servidor. Por favor, inténtalo más tarde.", type: "danger" });
  }
});

// Ruta para manejar POST en '/register'
router.post("/register", async (req, res) => {
  const { username, password, repeat_password } = req.body;

  // Verificar si las contraseñas coinciden
  if (password !== repeat_password) {
    return res.render("login", { message: "Las contraseñas no coinciden. Inténtalo de nuevo.", type: "danger" });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("login", { message: "El usuario ya existe. Inténtalo de nuevo.", type: "warning" });
    }

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      password, // El hashing de la contraseña se maneja en el modelo
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Establecer la cookie 'iamtoken' con el token del nuevo usuario
    res.cookie("iamtoken", newUser.token, { maxAge: 900000, httpOnly: true });

    // Redirigir al usuario a la página principal
    res.redirect("/");
  } catch (error) {
    // Manejar errores de validación y otros errores de Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.render("login", { message: messages.join(" "), type: "danger" });
    }

    console.error("Error al intentar registrar al usuario:", error);
    res.render("login", { message: "Error del servidor. Por favor, inténtalo más tarde.", type: "danger" });
  }
});

module.exports = router;
