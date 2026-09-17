// index-destinos.js — Backend tiene prioridad sobre estáticos

const STATS = [
  { valor: "6+",      label: "Destinos en Colombia", icono: "fas fa-map-location-dot" },
  { valor: "24/7",    label: "Acompañamiento",        icono: "fas fa-headset" },
  { valor: "15 años", label: "De experiencia",        icono: "fas fa-award" },
  { valor: "98%",     label: "Satisfacción",          icono: "fas fa-star" },
];

const IMAGEN_DEFAULT = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop";

function renderStats() {
  const contenedor = document.getElementById("stats-container");
  if (!contenedor) return;
  contenedor.innerHTML = STATS.map(s => `
    <div class="col-6 col-md-3 stat-item">
      <i class="${s.icono} fa-2x mb-2"></i>
      <h2>${s.valor}</h2>
      <p class="mb-0">${s.label}</p>
    </div>`).join("");
}

function crearTarjetaDestino(destino) {
  const img    = destino.img || destino.imagen || IMAGEN_DEFAULT;
  const lugar  = destino.lugar || destino.nombre || "Destino";
  const depto  = destino.departamento || destino.categoriaNombre || destino.categoria || "Colombia";
  const precio = destino.precio
    ? (typeof destino.precio === "number"
        ? `$${destino.precio.toLocaleString("es-CO")}`
        : destino.precio)
    : "";
  const icono  = destino.icono || "fas fa-map-marker-alt";
  const desc   = destino.descripcion || "";
  const id     = destino.id;
  const esFav  = esFavorito(id);

  return `
    <div class="col-md-6 col-lg-4">
      <article class="destino-card card border-0 h-100">
        <div class="destino-img-wrap position-relative">
          <img src="${img}" class="card-img-top destino-img" alt="${lugar}"
               onerror="this.src='${IMAGEN_DEFAULT}'">
          <button class="btn-favorito ${esFav ? 'activo' : ''}" 
                  onclick="toggleFavorito(${JSON.stringify(destino).replace(/"/g, '&quot;')}, this)"
                  title="${esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 class="fw-bold mb-0"><i class="${icono} me-2 text-primary"></i>${lugar}</h5>
            ${precio ? `<span class="badge-precio">${precio}</span>` : ""}
          </div>
          <small class="text-muted mb-2"><i class="fas fa-location-dot me-1"></i>${depto}</small>
          <p class="small text-muted flex-grow-1">${desc}</p>
          <div class="destino-info">
            ${destino.clima    ? `<span><i class="fas fa-cloud-sun me-1"></i>${destino.clima}</span>` : ""}
            ${destino.duracion ? `<span><i class="fas fa-calendar-days me-1"></i>${destino.duracion}</span>` : ""}
          </div>
          <a href="planes.html?destino=${encodeURIComponent(id)}" class="btn btn-primary w-100 mt-3">
            Ver información del lugar
          </a>
        </div>
      </article>
    </div>`;
}

async function cargarDestinosIndex() {
  const contenedor = document.getElementById("destinos-container");
  if (!contenedor) return;

  // 1. Mostrar estáticos mientras carga el backend
  const estaticos = obtenerDestinosColombia();
  contenedor.innerHTML = estaticos.map(crearTarjetaDestino).join("");

  // 2. Cargar del backend
  try {
    const productos = await apiGetProductos();
    if (!Array.isArray(productos) || !productos.length) return;

    // 3. Mezclar: el backend reemplaza al estático si el nombre coincide
    const backendMap = new Map(
      productos.map(p => [(p.nombre || "").toLowerCase(), p])
    );

    const resultado = estaticos.map(est => {
      const key = (est.lugar || "").toLowerCase();
      if (backendMap.has(key)) {
        const prod = backendMap.get(key);
        // Mezclar: datos del backend + datos extra del estático (clima, icono, etc.)
        return {
          ...est,
          img: prod.imagen || est.img,      // imagen del backend tiene prioridad
          precio: prod.precio || est.precio, // precio del backend tiene prioridad
          descripcion: prod.descripcion || est.descripcion,
          categoriaNombre: prod.categoriaNombre,
          id: prod.id,                       // ID del backend para el link
        };
      }
      return est;
    });

    // 4. Agregar productos del backend que no están en los estáticos
    const nombresEstaticos = new Set(estaticos.map(d => (d.lugar || "").toLowerCase()));
    const extras = productos.filter(p => !nombresEstaticos.has((p.nombre || "").toLowerCase()));

    contenedor.innerHTML = [...resultado, ...extras].map(crearTarjetaDestino).join("");
  } catch (e) {
    console.warn("Backend no disponible, usando estáticos:", e.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  cargarDestinosIndex();
});