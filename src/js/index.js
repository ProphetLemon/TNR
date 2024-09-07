/**
 * Se ejecuta cuando el DOM ha sido completamente cargado.
 * Añade un efecto ripple a los botones de tiradas al hacer clic.
 */
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".tiradas-buttons .btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Obtener la posición relativa del clic dentro del botón
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Establecer las propiedades CSS para el efecto ripple
      const ripple = document.createElement("span");
      ripple.style.left = `${x - 50}px`; // Ajuste para centrar el ripple
      ripple.style.top = `${y - 50}px`;
      ripple.classList.add("ripple");

      // Añadir el span al botón
      button.appendChild(ripple);

      // Eliminar el span después de la animación (600ms)
      setTimeout(() => {
        ripple.remove();
      }, 600); // Duración de la animación
    });
  });
});

/**
 * Se ejecuta cuando el DOM ha sido completamente cargado.
 * Maneja la interacción de los botones de tiradas y la visualización de los modales.
 */
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".tiradas-buttons .btn");
  const modalBody = document.querySelector("#resultModal .modal-body");
  const loadingModal = $("#loadingModal"); // Selecciona el modal de carga usando jQuery
  const resultModal = $("#resultModal"); // Selecciona el modal de resultados usando jQuery

  /**
   * Crea una tarjeta de resultado a partir de los datos de la carta.
   * @param {Object} carta - Objeto que representa la carta.
   * @param {string} carta.rareza - La rareza de la carta (e.g., común, rara).
   * @param {string} carta.imagenBase64 - Imagen de la carta en formato base64.
   * @param {string} carta.audioBase64 - Audio asociado a la carta en formato base64.
   * @returns {HTMLElement} cardContainer - El contenedor de la tarjeta.
   */
  function createCard(carta) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("result-card", carta.rareza, "is-flipped");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.style.backgroundImage = `url(${carta.imagenBase64})`;
    cardFront.style.backgroundSize = "cover";
    cardFront.style.backgroundPosition = "center";

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    cardContainer.appendChild(card);

    // Añadir evento para voltear la carta al hacer clic
    cardContainer.addEventListener("click", function () {
      const trigger = card.classList.toggle("is-flipped");
      if (!trigger) {
        const audioElement = document.getElementById("audio");
        audioElement.src = carta.audioBase64;
        audioElement.play();
      }
    });

    return cardContainer;
  }

  /**
   * Añade el evento de clic para los botones de tiradas.
   * Realiza la solicitud AJAX para obtener los resultados de las tiradas y manejar los modales.
   */
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // Deshabilitar los botones de tiradas mientras se procesa
      $(".tiradas-buttons .btn").prop("disabled", true);

      const numTiradas = parseInt(this.textContent.match(/\d+/)[0]); // Extrae el número de tiradas del botón

      modalBody.innerHTML = ""; // Limpia el contenido del modal de resultados

      // Mostrar el modal de carga antes de la llamada AJAX
      loadingModal.modal({
        backdrop: "static", // Evita el cierre al hacer clic fuera del modal
        keyboard: false, // Evita el cierre al presionar "Escape"
      });

      loadingModal.modal("show");

      // Una vez que el modal de carga ha sido completamente mostrado
      loadingModal.on("shown.bs.modal", function () {
        $.ajax({
          url: "/tiradas",
          type: "POST",
          data: { numTiradas: numTiradas }, // Enviar el número de tiradas como parámetro
          dataType: "json",
          success: function (response) {
            if (response.type === "success" && Array.isArray(response.cartas)) {
              response.cartas.forEach((carta) => {
                const cardContainer = createCard(carta); // Crear tarjeta para cada carta
                modalBody.appendChild(cardContainer); // Añadir la tarjeta al modal
              });

              // Ocultar el modal de carga y mostrar el modal de resultados
              loadingModal.modal("hide");

              // Cuando el modal de carga se haya ocultado completamente
              loadingModal.on("hidden.bs.modal", function () {
                resultModal.modal("show"); // Mostrar el modal de resultados
              });
            }
          },
          error: function (xhr, status, error) {
            console.error("Hubo un problema con la petición:", status, error);
            updateNotificationPartial(xhr.responseJSON.message || "Error en la petición", "danger");

            // Ocultar el modal de carga en caso de error
            loadingModal.modal("hide");
          },
        });
      });
    });
  });

  /**
   * Actualiza el contenido del partial de notificaciones.
   * @param {string} message - El mensaje que se va a mostrar en la notificación.
   * @param {string} type - El tipo de notificación (e.g., 'success', 'danger').
   */
  function updateNotificationPartial(message, type) {
    const notificationPartial = document.getElementById("notification-partial");

    if (notificationPartial) {
      notificationPartial.innerHTML = `
      <div class="alert alert-${type}" role="alert">
        ${message}
      </div>
    `;
    }
  }
});

/**
 * Refresca la página cuando el modal de resultados se cierra.
 */
document.addEventListener("DOMContentLoaded", function () {
  const resultModal = document.getElementById("resultModal");

  // Escuchar el evento de cierre del modal
  resultModal.addEventListener("hidden.bs.modal", function () {
    location.reload(); // Refrescar la página cuando el modal se cierre
  });
});
