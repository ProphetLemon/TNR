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

  // Función para determinar el tipo de carta ganada
  function getCardType() {
    const random = Math.random();
    if (random < 0.6) return "normal";
    if (random < 0.85) return "rara";
    if (random < 0.97) return "super-rara";
    return "legendaria";
  }

  // Función para crear una tarjeta con el resultado de la tirada
  function createCard(type) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("result-card", type, "is-flipped"); // Añade 'is-flipped' para que empiecen boca abajo

    // Lado frontal de la carta (revelado)
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = `Carta ${type.charAt(0).toUpperCase() + type.slice(1)}`;

    // Lado trasero de la carta (boca abajo)
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    //cardBack.textContent = "Carta";

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    cardContainer.appendChild(card);

    // Evento para voltear la carta
    cardContainer.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });

    return cardContainer;
  }

  // Función para manejar el clic en los botones de tiradas
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const numTiradas = parseInt(this.textContent.match(/\d+/)[0]); // Extrae el número de tiradas del texto del botón

      // Realiza la petición AJAX a /tiradas usando jQuery
      $.ajax({
        url: "/tiradas",
        type: "POST",
        data: { numTiradas: numTiradas },
        success: function (response) {
          if (response.type === "success") {
            modalBody.innerHTML = ""; // Limpia el contenido del modal

            // Genera las tarjetas y las añade al modal
            for (let i = 0; i < numTiradas; i++) {
              const cardType = getCardType();
              const cardContainer = createCard(cardType);
              modalBody.appendChild(cardContainer);
            }

            // Muestra el modal con los resultados
            resultModal.show();
          }

          $("h4 strong").text(response.tiradasRestantes);
        },
        error: function (xhr, status, error) {
          console.error("Hubo un problema con la petición:", status, error);
          // Actualizar el partial de notificaciones con un mensaje genérico de error
          updateNotificationPartial(xhr.responseJSON.message, "danger");
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
