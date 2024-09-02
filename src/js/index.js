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
    const card = document.createElement("div");
    card.classList.add("result-card", type);
    card.textContent = `Carta ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    return card;
  }

  // Función para manejar el clic en los botones de tiradas
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const numTiradas = parseInt(this.textContent.match(/\d+/)[0]); // Extrae el número de tiradas del texto del botón
      modalBody.innerHTML = ""; // Limpia el contenido del modal

      // Genera las tarjetas y las añade al modal
      for (let i = 0; i < numTiradas; i++) {
        const cardType = getCardType();
        const card = createCard(cardType);
        modalBody.appendChild(card);
      }

      // Muestra el modal con los resultados
      resultModal.show();
    });
  });
});
