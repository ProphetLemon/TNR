const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const utils = require("./utils");
const mongoose = require("mongoose");
const baseRouter = require("./routers/baseRouter");
const albumRouter = require("./routers/albumRouter");
const indexRouter = require("./routers/indexRouter");
const crearCartaRouter = require("./routers/crearCartaRouter");
const dotenv = require("dotenv");
const cron = require("node-cron");
const User = require("./models/user");

// Cargar variables de entorno desde .env
dotenv.config();
// Crear una instancia de Express
const app = express();

// Configurar el manejo de datos en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Para datos de formulario
app.use(express.json()); // Para datos JSON

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());

// Configurar archivos estáticos para que se sirvan desde /src
app.use("/src", express.static(path.join(__dirname, "src")));

// Usar el enrutador para manejar las rutas principales
app.use("/", baseRouter);

app.use("/tiradas", indexRouter);

app.use("/album", albumRouter);

app.use("/crear", crearCartaRouter);

// Conectar a MongoDB
mongoose
  .connect(process.env.BBDD_URL)
  .then(() => {
    console.log(`${utils.getCurrentDateTime()} - Conectado a MongoDB!`);
    // Tarea programada para ejecutarse cada 5 minutos
    cron.schedule("*/6 * * * *", async () => {
      try {
        const users = await User.find();
        users.forEach(async (user) => {
          if (user.tiradas < 60) {
            user.tiradas += 1;
          }
          await user.save();
        });
      } catch (error) {
        console.error("Error al actualizar los puntos:", error);
      }
    });
  })
  .catch((err) => {
    console.error(`${utils.getCurrentDateTime()} - Error al conectar a MongoDB:`, err);
  });

// Iniciar el servidor en el puerto 3000
app.listen(process.env.PORT || 5000, () => {
  console.log(`${utils.getCurrentDateTime()} - Aplicación iniciada!`);
});
