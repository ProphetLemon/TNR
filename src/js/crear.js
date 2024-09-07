$(document).ready(function () {
  // Previsualizar la imagen antes de subirla
  $("#imagen").change(function (e) {
    const input = e.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#preview-image").attr("src", e.target.result);
        $("#preview-image").removeClass("d-none");
      };
      reader.readAsDataURL(input.files[0]);
    }
  });

  // Validar el formulario antes de enviarlo
  $("form").submit(function (e) {
    const nombre = $("#nombre").val().trim();
    const rareza = $("#rareza").val();
    const imagen = $("#imagen").val();
    const audio = $("#audio").val();
    var loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"));

    // Verificar que todos los campos estén completos
    if (!nombre || !rareza || !imagen || !audio) {
      e.preventDefault(); // Evitar que el formulario se envíe
      alert("Todos los campos son obligatorios. Asegúrate de que todo esté lleno.");
      return;
    }

    // Verificar si se ha seleccionado un archivo de imagen y audio válido
    const imagenArchivo = $("#imagen")[0].files[0];
    const audioArchivo = $("#audio")[0].files[0];

    if (!imagenArchivo || !audioArchivo) {
      e.preventDefault();
      alert("Por favor, selecciona un archivo de imagen y audio.");
      return;
    }

    // Verificar que el archivo de imagen tenga una extensión válida (opcional)
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(imagenArchivo.type)) {
      e.preventDefault();
      alert("Por favor, selecciona un archivo de imagen válido (jpg, png o gif).");
      return;
    }

    // Verificar que el archivo de audio tenga una extensión válida (opcional)
    const validAudioTypes = ["audio/mpeg", "audio/wav"];
    if (!validAudioTypes.includes(audioArchivo.type)) {
      e.preventDefault();
      alert("Por favor, selecciona un archivo de audio válido (mp3 o wav).");
      return;
    }
    loadingModal.show();
  });
});
