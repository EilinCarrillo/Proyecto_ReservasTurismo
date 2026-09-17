// ================================================================
// api.js — Conexión centralizada con el backend Spring Boot
// ================================================================

const API_URL = "http://localhost:8080";

// ── TOKEN ────────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

// ── HEADERS ──────────────────────────────────────────────────────
function headersAuth() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

function headersPublic() {
  return { "Content-Type": "application/json" };
}

// ── FETCH GENÉRICO ───────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);

    if (res.status === 401) {
      cerrarSesionLocal();
      throw new Error("Correo o contraseña incorrectos");
    }

    if (res.status === 403) {
      throw new Error("No tienes permiso para realizar esta acción.");
    }

    if (res.status === 204) return null;

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.mensaje || "Error en la solicitud");
    }

    return data;

  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}

// ================================================================
// AUTH
// ================================================================

async function apiLogin(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    headers: headersPublic(),
    body: JSON.stringify({ username: email, password }),
  });
  return data;
}

async function apiLoginSesion(email, password) {
  // Login con sesión en memoria (AuthController)
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    headers: headersPublic(),
    body: JSON.stringify({ email, password }),
  });
  return data;
}

async function apiRegister(username, email, password) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    headers: headersPublic(),
    body: JSON.stringify({ username, email, password }),
  });
  return data;
}

async function apiLogout() {
  await apiFetch("/api/auth/logout", {
    method: "POST",
    headers: headersAuth(),
  });
}

// ================================================================
// PRODUCTOS
// ================================================================

async function apiGetProductos() {
  return await apiFetch("/productos", {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiGetProductosPorCategoria(categoriaId) {
  return await apiFetch(`/productos/categoria/${categoriaId}`, {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiCrearProducto(producto) {
  return await apiFetch("/productos", {
    method: "POST",
    headers: headersAuth(),
    body: JSON.stringify(producto),
  });
}

async function apiEditarProducto(id, producto) {
  return await apiFetch(`/productos/${id}`, {
    method: "PUT",
    headers: headersAuth(),
    body: JSON.stringify(producto),
  });
}

async function apiEliminarProducto(id) {
  return await apiFetch(`/productos/${id}`, {
    method: "DELETE",
    headers: headersAuth(),
  });
}

// ================================================================
// CATEGORÍAS
// ================================================================

async function apiGetCategorias() {
  return await apiFetch("/categorias", {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiCrearCategoria(nombre) {
  return await apiFetch("/categorias", {
    method: "POST",
    headers: headersAuth(),
    body: JSON.stringify({ nombre }),
  });
}

async function apiEliminarCategoria(id) {
  return await apiFetch(`/categorias/${id}`, {
    method: "DELETE",
    headers: headersAuth(),
  });
}

// ================================================================
// CARACTERÍSTICAS DE PRODUCTO
// ================================================================

async function apiGetCaracteristicas() {
  return await apiFetch("/caracteristicas", {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiGetCaracteristicasPorProducto(productoId) {
  // Intenta primero /productos/{id}/caracteristicas (REST anidado)
  // Si falla el apiFetch lanzará error y el caller prueba otra ruta
  return await apiFetch(`/productos/${productoId}/caracteristicas`, {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiCrearCaracteristica(caracteristica) {
  // Intenta POST /productos/{id}/caracteristicas primero
  try {
    return await apiFetch(`/productos/${caracteristica.productoId}/caracteristicas`, {
      method: "POST",
      headers: headersAuth(),
      body: JSON.stringify({ nombre: caracteristica.nombre, valor: caracteristica.valor }),
    });
  } catch (_) {}
  // Fallback: POST /caracteristicas con todo el objeto
  return await apiFetch("/caracteristicas", {
    method: "POST",
    headers: headersAuth(),
    body: JSON.stringify(caracteristica),
  });
}

async function apiEliminarCaracteristica(id) {
  return await apiFetch(`/caracteristicas/${id}`, {
    method: "DELETE",
    headers: headersAuth(),
  });
}

// ================================================================
// RESERVAS
// ================================================================

async function apiCrearReserva(usuarioId, productoId, cantidadPersonas) {
  return await apiFetch("/api/reservas", {
    method: "POST",
    headers: headersAuth(),
    body: JSON.stringify({ usuarioId, productoId, cantidadPersonas }),
  });
}

async function apiGetReservas() {
  return await apiFetch("/api/reservas", {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiGetReservasPorUsuario(usuarioId) {
  return await apiFetch(`/api/reservas/filtrar/usuario/${usuarioId}`, {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiCancelarReserva(id) {
  return await apiFetch(`/api/reservas/${id}/cancelar`, {
    method: "PATCH",
    headers: headersAuth(),
  });
}

async function apiEliminarReserva(id) {
  return await apiFetch(`/api/reservas/${id}`, {
    method: "DELETE",
    headers: headersAuth(),
  });
}

// ================================================================
// USUARIOS
// ================================================================

async function apiGetUsuarios() {
  return await apiFetch("/api/usuarios", {
    method: "GET",
    headers: headersAuth(),
  });
}

async function apiEliminarUsuario(id) {
  return await apiFetch(`/api/usuarios/${id}`, {
    method: "DELETE",
    headers: headersAuth(),
  });
}

// ================================================================
// SESIÓN LOCAL
// ================================================================

function guardarSesionLocal(token, nombre, rol, userId, email) {
  localStorage.setItem("token", token);
  localStorage.setItem("usuarioLogueado", "true");
  localStorage.setItem("nombreUsuario", nombre);
  localStorage.setItem("rolUsuario", rol);

  if (userId) localStorage.setItem("userId", userId);
  if (email) localStorage.setItem("emailUsuario", email);
}

function cerrarSesionLocal() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioLogueado");
  localStorage.removeItem("nombreUsuario");
  localStorage.removeItem("rolUsuario");
  localStorage.removeItem("userId");
  localStorage.removeItem("emailUsuario");
}

function estaLogueado() {
  return !!getToken() && localStorage.getItem("usuarioLogueado") === "true";
}

function esAdmin() {
  return localStorage.getItem("rolUsuario") === "ADMIN" ||
         localStorage.getItem("rolUsuario") === "admin";
}