// planes.js — soporta destinos estáticos y productos del backend

const IMAGEN_DEFAULT = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop";

function crearTarjetaPlan(destino) {
  const lugar    = destino.lugar || destino.nombre || "Destino";
  const img      = destino.img || destino.imagen || IMAGEN_DEFAULT;
  const depto    = destino.departamento || destino.categoriaNombre || destino.categoria || "Colombia";
  const icono    = destino.icono || "fas fa-map-marker-alt";
  const desc     = destino.descripcion || "";
  const clima    = destino.clima || null;
  const duracion = destino.duracion || null;
  const ideal    = destino.ideal || null;
  const precio   = destino.precio
    ? (typeof destino.precio === "number"
        ? `$${destino.precio.toLocaleString("es-CO")}`
        : destino.precio)
    : "";
  const actividades = Array.isArray(destino.actividades) && destino.actividades.length
    ? destino.actividades.map(a => `<li>${a}</li>`).join("")
    : (destino.caracteristicas
        ? destino.caracteristicas.split(",").map(c => `<li>${c.trim()}</li>`).join("")
        : "");

  const mapa   = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar + ", Colombia")}`;
  const favActivo = esFavorito(destino.id || destino.lugar);
  const destinoJson = JSON.stringify(destino).replace(/"/g, "&quot;");

  return `
    <div class="col-md-6 col-lg-4">
      <article class="plan-card h-100 d-flex flex-column">
        <div class="position-relative">
          <img src="${img}" alt="${lugar}" class="plan-img"
               onerror="this.src='${IMAGEN_DEFAULT}'">
          <button class="btn-favorito ${favActivo ? 'activo' : ''}"
                  onclick="toggleFavorito(${destinoJson}, this)"
                  title="${favActivo ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="plan-body flex-grow-1 d-flex flex-column">
          <span class="badge bg-secondary mb-2">${depto}</span>
          <h5 class="fw-bold mb-1"><i class="${icono} me-2 text-primary"></i>${lugar}</h5>
          <p class="text-muted small mb-2">${desc}</p>
          ${clima || duracion ? `
          <div class="plan-detail">
            ${clima    ? `<span><i class="fas fa-cloud-sun me-1"></i>${clima}</span>` : ""}
            ${duracion ? `<span><i class="fas fa-calendar-days me-1"></i>${duracion}</span>` : ""}
          </div>` : ""}
          ${ideal ? `<p class="small mt-3 mb-1 fw-semibold">Ideal para:</p>
          <p class="text-muted small mb-2">${ideal}</p>` : ""}
          ${actividades ? `<p class="small mb-1 fw-semibold">Qué puedes visitar:</p>
          <ul class="text-muted small plan-list flex-grow-1">${actividades}</ul>` : ""}
          ${precio ? `<p class="plan-precio mt-2">${precio} <span class="fs-6 fw-normal text-muted">/ persona</span></p>` : ""}
          <div class="d-grid gap-2 mt-auto">
            <a href="reservas.html?destino=${encodeURIComponent(lugar)}" class="btn btn-plan">
              <i class="fas fa-calendar-check me-1"></i> Reservar este lugar
            </a>
            <a href="${mapa}" target="_blank" rel="noopener" class="btn btn-outline-secondary">
              <i class="fas fa-map-marked-alt me-1"></i> Ver en mapa
            </a>
          </div>
        </div>
      </article>
    </div>`;
}

async function cargarPlanes() {
  const params         = new URLSearchParams(window.location.search);
  const destinoFiltro  = params.get("destino");
  const contenedor     = document.getElementById("planesContainer");
  const titulo         = document.querySelector(".planes h2");
  if (!contenedor) return;

  contenedor.innerHTML = `<div class="col-12 text-center py-5">
    <div class="spinner-border text-primary"></div></div>`;

  const estaticos = obtenerDestinosColombia();

  let delBackend = [];
  try {
    const productos = await apiGetProductos();
    if (Array.isArray(productos)) delBackend = productos;
  } catch (e) {
    console.warn("Backend no disponible, usando solo estáticos.");
  }

  const nombresEstaticos = new Set(estaticos.map(d => (d.lugar || "").toLowerCase()));
  const backendNuevos = delBackend.filter(p => !nombresEstaticos.has((p.nombre || "").toLowerCase()));
  const todos = [...estaticos, ...backendNuevos];

  let lista = todos;
  if (destinoFiltro) {
    lista = todos.filter(d => {
      const id     = String(d.id || "");
      const lugar  = (d.lugar || d.nombre || "").toLowerCase();
      const filtro = destinoFiltro.toLowerCase();
      return id === filtro || lugar === filtro || lugar.includes(filtro) || filtro.includes(lugar);
    });
  }

  if (titulo && destinoFiltro && lista.length) {
    const nombre = lista[0].lugar || lista[0].nombre || destinoFiltro;
    titulo.innerHTML = `Información de ${nombre}
      <a href="planes.html" class="btn btn-sm btn-outline-secondary ms-3">
        <i class="fas fa-arrow-left me-1"></i> Ver todos
      </a>`;
  }

  if (!lista.length) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning rounded-4">No encontramos ese destino en Colombia.</div>
      </div>`;
    return;
  }

  contenedor.innerHTML = lista.map(crearTarjetaPlan).join("");
}

document.addEventListener("DOMContentLoaded", cargarPlanes);