// base.js

document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleDarkMode");
  const body = document.body;
  const navbar = document.querySelector(".navbar");

  // Leer el valor de la cookie para determinar el modo inicial
  const darkMode = getCookie("darkMode");

  if (darkMode === "enabled") {
    body.classList.add("dark-mode");
    navbar.classList.add("navbar-dark-mode");
    toggleSwitch.checked = true; // Marcar el toggle si el modo oscuro está habilitado
  } else {
    body.classList.remove("dark-mode");
    navbar.classList.remove("navbar-dark-mode");
    toggleSwitch.checked = false; // Desmarcar el toggle si el modo claro está habilitado
  }

  // Función para alternar modo oscuro/claro
  toggleSwitch.addEventListener("change", function () {
    if (toggleSwitch.checked) {
      body.classList.add("dark-mode");
      navbar.classList.add("navbar-dark-mode");
      setCookie("darkMode", "enabled", 7); // Guarda la preferencia en la cookie por 7 días
    } else {
      body.classList.remove("dark-mode");
      navbar.classList.remove("navbar-dark-mode");
      setCookie("darkMode", "disabled", 7); // Guarda la preferencia en la cookie por 7 días
    }
  });
});

// Función para establecer una cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Función para obtener el valor de una cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
