
document.addEventListener("DOMContentLoaded", function () {
  const btnBuscar = document.getElementById("btnBuscar");
  const inputDestino = document.getElementById("buscarDestino");
  const resultados = document.getElementById("resultadosBusqueda");

  // Búsqueda en tiempo real mientras escribe
  inputDestino.addEventListener("input", function () {
    const texto = inputDestino.value.trim();
    if (texto.length >= 2) {
      buscar(texto);
    } else {
      resultados.innerHTML = "";
      mostrarTodosLosDestinos();
    }
  });

  // Búsqueda al hacer clic en el botón
  btnBuscar.addEventListener("click", function () {
    const texto = inputDestino.value.trim();
    if (!texto) {
      mostrarTodosLosDestinos();
      return;
    }
    buscar(texto);
    // Hacer scroll a los destinos
    document.getElementById("destinos").scrollIntoView({ behavior: "smooth" });
  });

  // Enter en el input
  inputDestino.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btnBuscar.click();
  });
});

async function buscar(texto) {
  const contenedor = document.getElementById("destinos-container");
  const resultados = document.getElementById("resultadosBusqueda");

  try {
    // 1. Buscar en el backend
    const productos = await apiGetProductos();
    const filtrados = productos.filter(p =>
      p.nombre.toLowerCase().includes(texto.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(texto.toLowerCase())) ||
      (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(texto.toLowerCase()))
    );

    // 2. También buscar en los destinos locales (destinos-data.js)
    const destinosLocales = obtenerDestinosColombia().filter(d =>
      d.lugar.toLowerCase().includes(texto.toLowerCase()) ||
      d.departamento.toLowerCase().includes(texto.toLowerCase()) ||
      d.descripcion.toLowerCase().includes(texto.toLowerCase())
    );

    // 3. Mostrar resultados
    if (filtrados.length === 0 && destinosLocales.length === 0) {
      resultados.innerHTML = `
        <div class="alert alert-warning">
          No encontramos destinos para "<strong>${texto}</strong>". 
          Intenta con: Cartagena, Medellín, San Andrés...
        </div>`;
      contenedor.innerHTML = "";
      return;
    }

    resultados.innerHTML = `
      <div class="alert alert-info py-2">
        Se encontraron <strong>${destinosLocales.length}</strong> destinos para "<strong>${texto}</strong>"
        <button class="btn btn-sm btn-outline-secondary ms-3" onclick="mostrarTodosLosDestinos()">
          <i class="fas fa-times me-1"></i>Ver todos
        </button>
      </div>`;

    // Mostrar los destinos filtrados
    contenedor.innerHTML = destinosLocales.map(crearTarjetaDestino).join("");

  } catch (e) {
    // Si falla el backend, buscar solo en datos locales
    const destinosLocales = obtenerDestinosColombia().filter(d =>
      d.lugar.toLowerCase().includes(texto.toLowerCase()) ||
      d.departamento.toLowerCase().includes(texto.toLowerCase())
    );

    const resultados = document.getElementById("resultadosBusqueda");
    const contenedor = document.getElementById("destinos-container");

    if (destinosLocales.length === 0) {
      resultados.innerHTML = `
        <div class="alert alert-warning">
          No encontramos destinos para "<strong>${texto}</strong>".
        </div>`;
      contenedor.innerHTML = "";
    } else {
      resultados.innerHTML = `
        <div class="alert alert-info py-2">
          ${destinosLocales.length} resultado(s) para "<strong>${texto}</strong>"
          <button class="btn btn-sm btn-outline-secondary ms-3" onclick="mostrarTodosLosDestinos()">
            Ver todos
          </button>
        </div>`;
      contenedor.innerHTML = destinosLocales.map(crearTarjetaDestino).join("");
    }
  }
}

function mostrarTodosLosDestinos() {
  const contenedor = document.getElementById("destinos-container");
  const resultados = document.getElementById("resultadosBusqueda");
  resultados.innerHTML = "";
  contenedor.innerHTML = obtenerDestinosColombia().map(crearTarjetaDestino).join("");
}