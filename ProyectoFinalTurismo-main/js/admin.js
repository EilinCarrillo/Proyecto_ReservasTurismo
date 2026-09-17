// ================================================================
// admin.js — Panel admin TurAventura
// Funcionalidades:
//   ✅ Identificar administrador
//   ✅ Listar productos (tabla con búsqueda)
//   ✅ Eliminar producto (con confirmación)
//   ✅ Categorizar productos (modal)
//   ✅ Administrar características de producto
//   ✅ Agregar categoría
//   ✅ Eliminar categoría
// ================================================================

// ── Estado local ─────────────────────────────────────────────────
let _productosCache = [];
let _categoriasCache = [];
let _productoCategorizandoId = null;
let _confirmCallback = null;
let _modalConfirmar = null;
let _modalCategorizar = null;


// ── Cloudinary ────────────────────────────────────────────────
const CLOUDINARY_CLOUD = "dtsialzm5";
const CLOUDINARY_PRESET = "turaventura";

async function subirImagenCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("folder", "turaventura/destinos");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error("Error subiendo imagen a Cloudinary");
  return data.secure_url;
}



// ── Protección de ruta ───────────────────────────────────────────
function protegerAdmin() {
  if (!estaLogueado() || !esAdmin()) {
    window.location.href = "login.html";
  }
}

// ── Toast helper ─────────────────────────────────────────────────
function mostrarToast(mensaje, tipo = "success") {
  const toastEl = document.getElementById("adminToast");
  const toastMsg = document.getElementById("adminToastMsg");
  if (!toastEl) return;
  toastEl.className = `toast align-items-center text-bg-${tipo} border-0`;
  toastMsg.textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 }).show();
}

// ── Identificación del administrador ────────────────────────────
function mostrarIdentidadAdmin() {
  const nombre = localStorage.getItem("nombreUsuario") || "Administrador";
  const email  = localStorage.getItem("emailUsuario") || "";
  const card   = document.getElementById("adminIdentidad");
  if (card) {
    document.getElementById("adminNombre").textContent = nombre;
    if (email) document.getElementById("adminEmail").textContent = email;
    card.style.display = "block";
  }
}

// ── Tabs ─────────────────────────────────────────────────────────
function inicializarTabs() {
  document.querySelectorAll("#adminTabs .nav-link").forEach(btn => {
    btn.addEventListener("click", () => {
      // Desactivar todos
      document.querySelectorAll("#adminTabs .nav-link").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane-admin").forEach(p => p.classList.add("d-none"));
      // Activar el seleccionado
      btn.classList.add("active");
      const tabId = btn.dataset.tab;
      document.getElementById("tab-" + tabId)?.classList.remove("d-none");
      // Cargar datos del tab si es necesario
      if (tabId === "categorias") renderCategorias();
      if (tabId === "caracteristicas") renderCaracteristicas();
      if (tabId === "usuarios") renderUsuarios();
      if (tabId === "productos") renderProductos();
    });
  });
}

// ── STATS ────────────────────────────────────────────────────────
async function renderAdminStats() {
  try {
    const [reservas, usuarios, productos] = await Promise.all([
      apiGetReservas().catch(() => []),
      apiGetUsuarios().catch(() => []),
      apiGetProductos().catch(() => []),
    ]);
    const viajeros = reservas.reduce((t, r) => t + Number(r.cantidadPersonas || 0), 0);
    document.getElementById("adminStats").innerHTML = [
      { icono: "fas fa-calendar-check",    valor: reservas.length,  label: "Reservas"            },
      { icono: "fas fa-users",             valor: usuarios.length,  label: "Usuarios registrados" },
      { icono: "fas fa-map-location-dot",  valor: productos.length, label: "Productos activos"    },
      { icono: "fas fa-suitcase-rolling",  valor: viajeros,         label: "Viajeros reservados"  },
    ].map(s => `
      <div class="col-6 col-lg-3">
        <article class="admin-stat h-100 text-center">
          <i class="${s.icono} mb-2 fa-2x"></i>
          <strong class="d-block fs-2">${s.valor}</strong>
          <span class="text-muted small">${s.label}</span>
        </article>
      </div>`).join("");
  } catch (e) {
    console.error("Error cargando stats:", e.message);
  }
}

// ════════════════════════════════════════════════════════════════
// RESERVAS
// ════════════════════════════════════════════════════════════════
async function renderReservas() {
  const tabla = document.getElementById("tablaReservasAdmin");
  try {
    const reservas = await apiGetReservas();
    if (!reservas.length) {
      tabla.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">
        <i class="fas fa-inbox fa-2x mb-2 d-block"></i>No hay reservas aún.</td></tr>`;
      return;
    }
    tabla.innerHTML = reservas.map(r => `
      <tr>
        <td class="text-muted small">#${r.id}</td>
        <td>
          <strong>${r.usuario?.username || "N/A"}</strong>
          <div class="text-muted small">${r.usuario?.email || ""}</div>
        </td>
        <td>${r.producto?.nombre || "N/A"}</td>
        <td>${r.fecha_creacion ? r.fecha_creacion.split("T")[0] : "N/A"}</td>
        <td>${r.cantidad_personas ?? r.cantidadPersonas ?? "—"}</td>
        <td><span class="badge ${r.estado === "ACTIVA" ? "bg-success" : "bg-secondary"}">${r.estado}</span></td>
        <td class="text-end">
          ${r.estado === "ACTIVA" ? `
            <button class="btn btn-sm btn-outline-warning me-1" title="Cancelar"
                    onclick="cancelarReservaAdmin(${r.id})">
              <i class="fas fa-ban"></i>
            </button>` : ""}
          <button class="btn btn-sm btn-outline-danger" title="Eliminar"
                  onclick="pedirConfirmacion('¿Eliminar la reserva #${r.id}?', () => eliminarReservaAdmin(${r.id}))">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`).join("");
  } catch (e) {
    tabla.innerHTML = `<tr><td colspan="7" class="text-danger p-3">
      <i class="fas fa-circle-exclamation me-1"></i>Error: ${e.message}</td></tr>`;
  }
}

async function cancelarReservaAdmin(id) {
  try {
    await apiCancelarReserva(id);
    mostrarToast("Reserva cancelada correctamente.");
    renderReservas();
    renderAdminStats();
  } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
}

async function eliminarReservaAdmin(id) {
  try {
    await apiEliminarReserva(id);
    mostrarToast("Reserva eliminada.");
    renderReservas();
    renderAdminStats();
  } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
}

// ════════════════════════════════════════════════════════════════
// PRODUCTOS — LISTAR
// ════════════════════════════════════════════════════════════════
async function renderProductos() {
  const tabla = document.getElementById("tablaProductosAdmin");
  if (!tabla) return;
  tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">
    <div class="spinner-border spinner-border-sm me-2"></div>Cargando...</td></tr>`;
  try {
    _productosCache = await apiGetProductos();
    renderTablaProductos(_productosCache);
    // Poblar select de características
    poblarSelectProductos();
    poblarSelectFiltroChar();
  } catch (e) {
    tabla.innerHTML = `<tr><td colspan="5" class="text-danger p-3">Error: ${e.message}</td></tr>`;
  }
}

function renderTablaProductos(lista) {
  const tabla = document.getElementById("tablaProductosAdmin");
  if (!lista.length) {
    tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">
      <i class="fas fa-inbox fa-2x mb-2 d-block"></i>No hay productos publicados.</td></tr>`;
    return;
  }
  tabla.innerHTML = lista.map(p => {
    const catNombre = p.categoriaNombre || p.categoria?.nombre || "Sin categoría";
    const precio = p.precio ? `$${Number(p.precio).toLocaleString("es-CO")}` : "—";
    return `
      <tr>
        <td class="text-muted small">#${p.id}</td>
        <td>
          <strong>${p.nombre}</strong>
          <div class="text-muted small text-truncate" style="max-width:200px">${p.descripcion || ""}</div>
        </td>
        <td><span class="badge bg-info text-dark">${catNombre}</span></td>
        <td>${precio}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1" title="Editar"
                  onclick="cargarProductoEnFormulario(${p.id})">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-outline-primary me-1" title="Cambiar categoría"
                  onclick="abrirModalCategorizar(${p.id})">
            <i class="fas fa-tags"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" title="Eliminar"
                  onclick="pedirConfirmacion('¿Eliminar el producto «${p.nombre}»?', () => eliminarProductoAdmin(${p.id}))">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`;
  }).join("");
}

// Búsqueda en tiempo real
function filtrarProductos(texto) {
  const q = texto.toLowerCase();
  const filtrados = _productosCache.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    (p.descripcion || "").toLowerCase().includes(q) ||
    (p.categoriaNombre || p.categoria?.nombre || "").toLowerCase().includes(q)
  );
  renderTablaProductos(filtrados);
}

// ════════════════════════════════════════════════════════════════
// PRODUCTOS — AGREGAR / EDITAR
// ════════════════════════════════════════════════════════════════
async function configurarFormularioProducto() {
  await cargarCategoriasEnSelect("adminCategoria");



document.getElementById("formProductoAdmin")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("mensajeDestinoAdmin");
    const id = document.getElementById("productoEditandoId").value;
    const categoriaId = parseInt(document.getElementById("adminCategoria").value);
    if (!categoriaId) {
      msg.innerHTML = `<span class="text-danger"><i class="fas fa-circle-exclamation me-1"></i>Selecciona una categoría.</span>`;
      return;
    }

    // Subir imagen a Cloudinary si seleccionaron una
    let imagenUrl = document.getElementById("adminImagen").value || null;
    const fileInput = document.getElementById("adminImagenFile");
    if (fileInput.files && fileInput.files[0]) {
      const progress = document.getElementById("uploadProgress");
      progress.style.display = "block";
      try {
        imagenUrl = await subirImagenCloudinary(fileInput.files[0]);
      } catch (err) {
        progress.style.display = "none";
        msg.innerHTML = `<span class="text-danger"><i class="fas fa-circle-exclamation me-1"></i>Error subiendo imagen: ${err.message}</span>`;
        return;
      }
      progress.style.display = "none";
    }

    const payload = {
      nombre:      document.getElementById("adminLugar").value.trim(),
      descripcion: document.getElementById("adminDescripcion").value.trim(),
      precio:      parseFloat(document.getElementById("adminPrecio").value) || 0,
      imagen:      imagenUrl,
      categoriaId,
    };



    try {
      if (id) {
        await apiEditarProducto(id, payload);
        msg.innerHTML = `<span class="text-success"><i class="fas fa-check me-1"></i>Producto actualizado.</span>`;
        mostrarToast("Producto actualizado correctamente.");
      } else {
        await apiCrearProducto(payload);
        msg.innerHTML = `<span class="text-success"><i class="fas fa-check me-1"></i>Producto guardado.</span>`;
        mostrarToast("Producto creado correctamente.");
      }
      e.target.reset();
      cancelarEdicionProducto();
      await renderProductos();
      await renderAdminStats();
    } catch (err) {
      msg.innerHTML = `<span class="text-danger"><i class="fas fa-circle-exclamation me-1"></i>Error: ${err.message}</span>`;
    }
  });
}

function cargarProductoEnFormulario(id) {
  const p = _productosCache.find(x => x.id === id);
  if (!p) return;
  document.getElementById("productoEditandoId").value = p.id;
  document.getElementById("adminLugar").value = p.nombre;
  document.getElementById("adminDescripcion").value = p.descripcion || "";
  document.getElementById("adminPrecio").value = p.precio || "";
  const catId = p.categoriaId || p.categoria?.id || "";
  document.getElementById("adminCategoria").value = catId;
  document.getElementById("adminImagen").value = p.imagen || "";
  const prev = document.getElementById("previewImagen");
  if (prev && p.imagen) {
    prev.innerHTML = `<img src="${p.imagen}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;border:1px solid #dee2e6" onerror="this.style.display='none'">`;
  }
  document.getElementById("tituloFormProducto").innerHTML =
    `<i class="fas fa-pen me-2 text-warning"></i>Editar producto`;
  document.getElementById("btnGuardarTexto").textContent = "Actualizar";
  document.getElementById("btnCancelarEdicion").style.display = "inline-block";
  document.getElementById("mensajeDestinoAdmin").innerHTML = "";
  // Ir al tab de productos
  document.querySelector('[data-tab="productos"]')?.click();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelarEdicionProducto() {
  document.getElementById("productoEditandoId").value = "";
  document.getElementById("formProductoAdmin")?.reset();
  document.getElementById("tituloFormProducto").innerHTML =
    `<i class="fas fa-plus me-2 text-success"></i>Agregar producto`;
  document.getElementById("btnGuardarTexto").textContent = "Guardar";
  document.getElementById("btnCancelarEdicion").style.display = "none";
  document.getElementById("mensajeDestinoAdmin").innerHTML = "";
  const prev = document.getElementById("previewImagen");
  if (prev) prev.innerHTML = "";
}

// ════════════════════════════════════════════════════════════════
// PRODUCTOS — ELIMINAR
// ════════════════════════════════════════════════════════════════
async function eliminarProductoAdmin(id) {
  try {
    await apiEliminarProducto(id);
    mostrarToast("Producto eliminado.");
    await renderProductos();
    await renderAdminStats();
  } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
}

// ════════════════════════════════════════════════════════════════
// PRODUCTOS — CATEGORIZAR (modal)
// ════════════════════════════════════════════════════════════════
async function abrirModalCategorizar(productoId) {
  _productoCategorizandoId = productoId;
  const p = _productosCache.find(x => x.id === productoId);
  document.getElementById("modalProductoNombre").textContent = p?.nombre || `#${productoId}`;
  await cargarCategoriasEnSelect("modalCatSelect", p?.categoriaId || p?.categoria?.id);
  _modalCategorizar?.show();
}

async function guardarCategorizacion() {
  const nuevaCatId = parseInt(document.getElementById("modalCatSelect").value);
  if (!nuevaCatId || !_productoCategorizandoId) return;
  const p = _productosCache.find(x => x.id === _productoCategorizandoId);
  if (!p) return;
  try {
    await apiEditarProducto(_productoCategorizandoId, {
      nombre:      p.nombre,
      descripcion: p.descripcion,
      precio:      p.precio,
      categoriaId: nuevaCatId,
    });
    _modalCategorizar?.hide();
    mostrarToast("Categoría del producto actualizada.");
    await renderProductos();
  } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
}

// ════════════════════════════════════════════════════════════════
// CATEGORÍAS — LISTAR
// ════════════════════════════════════════════════════════════════
async function renderCategorias() {
  const contenedor = document.getElementById("listaCategorias");
  if (!contenedor) return;
  contenedor.innerHTML = `<div class="text-center text-muted py-3">
    <div class="spinner-border spinner-border-sm me-2"></div>Cargando...</div>`;
  try {
    _categoriasCache = await apiGetCategorias();
    if (!_categoriasCache.length) {
      contenedor.innerHTML = `<p class="text-muted">No hay categorías registradas.</p>`;
      return;
    }
    contenedor.innerHTML = `
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>#</th><th>Nombre</th><th>Productos</th><th class="text-end">Acciones</th></tr></thead>
          <tbody>
            ${_categoriasCache.map(c => {
              const total = _productosCache.filter(p =>
                (p.categoriaId || p.categoria?.id) === c.id
              ).length;
              return `
                <tr>
                  <td class="text-muted small">#${c.id}</td>
                  <td><strong>${c.nombre}</strong></td>
                  <td><span class="badge bg-secondary">${total} producto${total !== 1 ? "s" : ""}</span></td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger"
                            onclick="pedirConfirmacion('¿Eliminar la categoría «${c.nombre}»?', () => eliminarCategoriaAdmin(${c.id}))">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
    // Actualizar selects
    await cargarCategoriasEnSelect("adminCategoria");
    await cargarCategoriasEnSelect("modalCatSelect");
  } catch (e) {
    contenedor.innerHTML = `<p class="text-danger">Error: ${e.message}</p>`;
  }
}

// ════════════════════════════════════════════════════════════════
// CATEGORÍAS — AGREGAR
// ════════════════════════════════════════════════════════════════
function configurarFormularioCategoria() {
  document.getElementById("formCategoriaAdmin")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("mensajeCategoriaAdmin");
    const nombre = document.getElementById("categoriaNombre").value.trim();
    if (!nombre) return;
    try {
      await apiCrearCategoria(nombre);
      mostrarToast(`Categoría «${nombre}» creada.`);
      e.target.reset();
      msg.innerHTML = `<span class="text-success"><i class="fas fa-check me-1"></i>Categoría creada exitosamente.</span>`;
      await renderCategorias();
      await cargarCategoriasEnSelect("adminCategoria");
    } catch (err) {
      msg.innerHTML = `<span class="text-danger"><i class="fas fa-circle-exclamation me-1"></i>Error: ${err.message}</span>`;
    }
  });
}

// ════════════════════════════════════════════════════════════════
// CATEGORÍAS — ELIMINAR
// ════════════════════════════════════════════════════════════════
async function eliminarCategoriaAdmin(id) {
  try {
    await apiEliminarCategoria(id);
    mostrarToast("Categoría eliminada.");
    await renderCategorias();
    await cargarCategoriasEnSelect("adminCategoria");
  } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
}

// ════════════════════════════════════════════════════════════════
// CARACTERÍSTICAS DE PRODUCTO
// Estrategia: intenta GET /productos/{id}/caracteristicas por cada
// producto. Si el backend no tiene ese endpoint, extrae las
// características del campo `caracteristicas` del objeto producto.
// ════════════════════════════════════════════════════════════════

// Obtiene características: primero intenta el endpoint dedicado,
// si falla usa los datos embebidos en el producto.
async function obtenerCaracteristicasDeProducto(producto) {
  // Intento 1: endpoint /productos/{id}/caracteristicas
  try {
    const data = await apiGetCaracteristicasPorProducto(producto.id);
    if (Array.isArray(data)) return data.map(c => ({ ...c, _productoNombre: producto.nombre, _productoId: producto.id }));
  } catch (_) {}

  // Intento 2: endpoint /caracteristicas/producto/{id}
  try {
    const data = await apiFetch(`/caracteristicas/producto/${producto.id}`, {
      method: "GET", headers: headersAuth()
    });
    if (Array.isArray(data)) return data.map(c => ({ ...c, _productoNombre: producto.nombre, _productoId: producto.id }));
  } catch (_) {}

  // Fallback: datos embebidos en el objeto producto
  const embebidas = producto.caracteristicas || producto.features || [];
  return embebidas.map(c => ({ ...c, _productoNombre: producto.nombre, _productoId: producto.id }));
}

async function renderCaracteristicas(filtroProductoId = "") {
  const contenedor = document.getElementById("listaCaracteristicas");
  if (!contenedor) return;
  contenedor.innerHTML = `<div class="text-center text-muted py-3">
    <div class="spinner-border spinner-border-sm me-2"></div>Cargando...</div>`;
  try {
    // Si no tenemos productos cargados, cargarlos primero
    if (!_productosCache.length) {
      _productosCache = await apiGetProductos();
    }

    const productosFiltrados = filtroProductoId
      ? _productosCache.filter(p => String(p.id) === String(filtroProductoId))
      : _productosCache;

    // Recoger características de cada producto
    const grupos = await Promise.all(
      productosFiltrados.map(p => obtenerCaracteristicasDeProducto(p))
    );
    const todas = grupos.flat();

    if (!todas.length) {
      contenedor.innerHTML = `<p class="text-muted text-center py-4">
        <i class="fas fa-inbox fa-2x d-block mb-2"></i>
        No hay características registradas${filtroProductoId ? " para este producto" : ""}.</p>`;
      return;
    }

    contenedor.innerHTML = `
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Producto</th><th>Atributo</th><th>Valor</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${todas.map(c => {
              const nombre  = c.nombre || c.clave || c.atributo || "—";
              const valor   = c.valor || c.value || "—";
              const prod    = c._productoNombre || "—";
              const safeNom = nombre.replace(/'/g, "\\'");
              return `
                <tr>
                  <td><span class="badge bg-secondary">${prod}</span></td>
                  <td><strong>${nombre}</strong></td>
                  <td>${valor}</td>
                  <td class="text-end">
                    ${c.id ? `
                    <button class="btn btn-sm btn-outline-danger"
                            onclick="pedirConfirmacion('¿Eliminar «${safeNom}»?', () => eliminarCaracteristicaAdmin(${c.id}, '${filtroProductoId}'))">
                      <i class="fas fa-trash"></i>
                    </button>` : `<span class="text-muted small">—</span>`}
                  </td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  } catch (e) {
    contenedor.innerHTML = `<p class="text-danger">
      <i class="fas fa-circle-exclamation me-1"></i>Error: ${e.message}</p>`;
  }
}

function renderCaracteristicasFiltradas(productoId) {
  renderCaracteristicas(productoId);
}

function poblarSelectProductos() {
  const sel = document.getElementById("charProductoId");
  if (!sel) return;
  sel.innerHTML = `<option value="">Selecciona un producto</option>` +
    _productosCache.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("");
}

function poblarSelectFiltroChar() {
  const sel = document.getElementById("filtroProductoChar");
  if (!sel) return;
  sel.innerHTML = `<option value="">— Todos los productos —</option>` +
    _productosCache.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("");
}

function configurarFormularioCaracteristica() {
  document.getElementById("formCaracteristicaAdmin")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("mensajeCaracteristicaAdmin");
    const productoId = parseInt(document.getElementById("charProductoId").value);
    const nombre = document.getElementById("charNombre").value.trim();
    const valor  = document.getElementById("charValor").value.trim();
    if (!productoId || !nombre || !valor) {
      msg.innerHTML = `<span class="text-danger">Completa todos los campos.</span>`;
      return;
    }
    try {
      // Intenta los tres formatos de payload más comunes en Spring Boot
      await apiCrearCaracteristica({ productoId, nombre, valor });
      mostrarToast("Característica guardada.");
      e.target.reset();
      msg.innerHTML = `<span class="text-success"><i class="fas fa-check me-1"></i>Característica guardada.</span>`;
      const filtro = document.getElementById("filtroProductoChar")?.value || "";
      renderCaracteristicas(filtro);
    } catch (err) {
      msg.innerHTML = `<span class="text-danger">
        <i class="fas fa-circle-exclamation me-1"></i>Error: ${err.message}</span>`;
    }
  });
}

async function eliminarCaracteristicaAdmin(id, filtroActual = "") {
  try {
    await apiEliminarCaracteristica(id);
    mostrarToast("Característica eliminada.");
    renderCaracteristicas(filtroActual);
  } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
}

// ════════════════════════════════════════════════════════════════
// USUARIOS
// ════════════════════════════════════════════════════════════════
async function renderUsuarios() {
  const tabla = document.getElementById("tablaUsuariosAdmin");
  if (!tabla) return;
  tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">
    <div class="spinner-border spinner-border-sm me-2"></div>Cargando...</td></tr>`;
  try {
    const usuarios = await apiGetUsuarios();
    if (!usuarios.length) {
      tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay usuarios.</td></tr>`;
      return;
    }
    tabla.innerHTML = usuarios.map((u, i) => `
      <tr>
        <td class="text-muted small">${i + 1}</td>
        <td><strong>${u.username}</strong></td>
        <td>${u.email || "—"}</td>
        <td>
          <span class="badge ${u.rol === "ADMIN" ? "bg-danger" : "bg-info text-dark"}">${u.rol}</span>
        </td>
        <td class="text-end">

  ${u.rol === "ADMIN"
    ? `
      <button class="btn btn-sm btn-outline-warning me-1"
              onclick="cambiarRolUsuario(${u.id}, 'USER')">
        <i class="fas fa-user-minus"></i>
      </button>
    `
    : `
      <button class="btn btn-sm btn-outline-success me-1"
              onclick="cambiarRolUsuario(${u.id}, 'ADMIN')">
        <i class="fas fa-user-shield"></i>
      </button>
    `
  }

  <button class="btn btn-sm btn-outline-danger"
          onclick="pedirConfirmacion('¿Eliminar al usuario «${u.username}»?', () => eliminarUsuarioAdmin(${u.id}))">
    <i class="fas fa-trash"></i>
  </button>

</td>
      </tr>`).join("");
  } catch (e) {
    tabla.innerHTML = `<tr><td colspan="5" class="text-danger p-3">Error: ${e.message}</td></tr>`;
  }
}

async function eliminarUsuarioAdmin(id) {
  try {
    await apiEliminarUsuario(id);
    mostrarToast("Usuario eliminado.");
    renderUsuarios();
    renderAdminStats();
  } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
}

async function cambiarRolUsuario(id, rol) {
  try {

    await apiFetch(`/api/usuarios/${id}/rol`, {
      method: "PUT",
      headers: headersAuth(),
      body: JSON.stringify({ rol }),
    });

    mostrarToast(
      rol === "ADMIN"
        ? "Usuario convertido en administrador."
        : "Administrador removido correctamente."
    );

    renderUsuarios();

  } catch (e) {
    mostrarToast("Error: " + e.message, "danger");
  }
}

// ── Helpers ──────────────────────────────────────────────────────

async function cargarCategoriasEnSelect(selectId, valorSeleccionado = null) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  try {
    if (!_categoriasCache.length) _categoriasCache = await apiGetCategorias();
    if (!_categoriasCache.length) {
      // Crear categoría por defecto si no hay ninguna
      const nueva = await apiCrearCategoria("Turismo Nacional");
      _categoriasCache = [nueva];
    }
    sel.innerHTML = _categoriasCache.map(c =>
      `<option value="${c.id}" ${valorSeleccionado == c.id ? "selected" : ""}>${c.nombre}</option>`
    ).join("");
  } catch (e) {
    sel.innerHTML = `<option value="">Error cargando categorías</option>`;
  }
}

function pedirConfirmacion(texto, callback) {
  document.getElementById("modalConfirmarTexto").textContent = texto;
  _confirmCallback = callback;
  _modalConfirmar?.show();
}

// ════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ════════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
  protegerAdmin();
  mostrarIdentidadAdmin();
  inicializarTabs();

  // Instanciar modales Bootstrap
  _modalConfirmar  = new bootstrap.Modal(document.getElementById("modalConfirmar"));
  _modalCategorizar = new bootstrap.Modal(document.getElementById("modalCategorizar"));

  // Botón confirmar eliminar
  document.getElementById("btnConfirmarAccion")?.addEventListener("click", () => {
    _modalConfirmar?.hide();
    if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
  });

  // Botón limpiar todas las reservas
  document.getElementById("btnLimpiarReservas")?.addEventListener("click", () => {
    pedirConfirmacion("¿Eliminar TODAS las reservas? Esta acción no se puede deshacer.", async () => {
      try {
        const reservas = await apiGetReservas();
        await Promise.all(reservas.map(r => apiEliminarReserva(r.id)));
        mostrarToast("Todas las reservas eliminadas.");
        renderReservas();
        renderAdminStats();
      } catch (e) { mostrarToast("Error: " + e.message, "danger"); }
    });
  });

  // Configurar formularios
  await configurarFormularioProducto();
  configurarFormularioCategoria();
  configurarFormularioCaracteristica();

  // Carga inicial de datos
  await Promise.all([
    renderAdminStats(),
    renderReservas(),
    renderProductos(),
  ]);
});