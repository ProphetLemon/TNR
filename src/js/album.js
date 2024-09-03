$(document).ready(function () {
  // Inicializa Turn.js con la configuración recomendada para móviles
  $("#flipbook").turn({
    width: $("#album-container").width(),
    height: $("#album-container").width() * 0.75, // Mantén la proporción 4:3
    autoCenter: true,
    display: "double",
    acceleration: true, // Habilita la aceleración CSS
    gradients: true, // Habilita los gradientes para una animación más suave
    duration: 1000, // Duración del giro de página
    turnCorners: "bl,br", // Habilita las esquinas inferiores para girar
    // Habilitar eventos táctiles manualmente
    when: {
      turning: function (event, page, view) {
        console.log("Página cambiando a " + page);
      },
      turned: function (event, page, view) {
        console.log("Página " + page + " mostrada");
        if (page > 2) {
          $("#back-to-start").fadeIn();
        } else {
          $("#back-to-start").fadeOut();
        }
      },
    },
  });

  // Redimensiona el flipbook cuando la ventana cambia de tamaño
  $(window).resize(function () {
    $("#flipbook").turn("size", $("#album-container").width(), $("#album-container").width() * 0.75);
  });

  // Asegúrate de que el flipbook se inicializa con el tamaño adecuado
  $("#flipbook").turn("size", $("#album-container").width(), $("#album-container").width() * 0.75);

  // Vuelve a la primera página cuando se haga clic en el botón
  $("#back-to-start").click(function () {
    $("#flipbook").turn("page", 1);
  });
});
