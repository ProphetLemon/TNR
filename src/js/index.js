document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".tiradas-buttons .btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Obtener la posición relativa del click dentro del botón
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

      // Eliminar el span después de la animación
      setTimeout(() => {
        ripple.remove();
      }, 600); // Duración de la animación
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".tiradas-buttons .btn");
  const modalBody = document.querySelector("#resultModal .modal-body");
  const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));

  // Función para crear una tarjeta con el resultado de la tirada
  function createCard(carta) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("result-card", carta.rareza, "is-flipped"); // Añadir 'is-flipped' para que empiece boca abajo

    // Lado frontal de la carta (revelado)
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    // Establecer la imagen de fondo desde la propiedad 'url' de la carta
    cardFront.style.backgroundImage = `url(${carta.url})`;
    cardFront.style.backgroundSize = "cover"; // Asegura que la imagen cubra completamente la tarjeta
    cardFront.style.backgroundPosition = "center"; // Centra la imagen en la tarjeta

    // Lado trasero de la carta (boca abajo)
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    cardContainer.appendChild(card);

    // Evento para voltear la carta
    cardContainer.addEventListener("click", function () {
      var trigger = card.classList.toggle("is-flipped");
      if (!trigger) {
        const audioElement = document.getElementById("audio");
        audioElement.src = `/src/audio/${carta.nombre}.mp3`;
        audioElement.play();
      }
    });

    return cardContainer;
  }

  // Función para manejar el clic en los botones de tiradas
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const numTiradas = parseInt(this.textContent.match(/\d+/)[0]); // Extrae el número de tiradas del texto del botón

      modalBody.innerHTML = ""; // Limpia el contenido del modal antes de cada tirada

      // Realizar una única llamada a /tiradas pasando el número de tiradas
      $.ajax({
        url: "/tiradas",
        type: "POST",
        data: { numTiradas: numTiradas }, // Enviar el número de tiradas como parámetro
        dataType: "json", // Aseguramos que la respuesta sea JSON
        success: function (response) {
          if (response.type === "success" && Array.isArray(response.cartas)) {
            // Itera sobre las cartas devueltas y crea una para cada una
            response.cartas.forEach((carta) => {
              const cardContainer = createCard(carta); // Crea la carta usando los datos del backend
              modalBody.appendChild(cardContainer); // Añade la carta al modal
            });

            // Mostrar el modal con los resultados
            resultModal.show();
          }
        },
        error: function (xhr, status, error) {
          console.error("Hubo un problema con la petición:", status, error);
          updateNotificationPartial(xhr.responseJSON.message || "Error en la petición", "danger");
        },
      });
    });
  });

  // Función para actualizar el partial de notificaciones
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

document.addEventListener("DOMContentLoaded", function () {
  const resultModal = document.getElementById("resultModal");

  // Escuchar el evento de cierre del modal
  resultModal.addEventListener("hidden.bs.modal", function () {
    // Refrescar la página cuando el modal se cierre
    location.reload();
  });
});
