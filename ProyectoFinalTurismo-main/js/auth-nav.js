// auth-nav.js — Integrado con backend

async function cerrarSesion() {
  try {
    if (localStorage.getItem("token")) {
      await apiLogout();
    }
  } catch (e) {
    console.warn("Error al cerrar sesion en el servidor:", e.message);
  } finally {
    cerrarSesionLocal();
    window.location.href = "index.html";
  }
}

function configurarNavbar() {
  const logueado = estaLogueado();
  const nombre = localStorage.getItem("nombreUsuario") || "";
  const rol = localStorage.getItem("rolUsuario") || "USER";
  const btnLogin   = document.getElementById("btnLogin");
  const btnReservar = document.getElementById("btnReservar");
  const btnAdmin   = document.getElementById("btnAdmin");
  const btnLogout  = document.getElementById("btnLogout");

  if (logueado) {
    btnLogin?.classList.add("d-none");
    btnReservar?.classList.remove("d-none");
    btnLogout?.classList.remove("d-none");

    if (esAdmin()) {
      btnAdmin?.classList.remove("d-none");
    }

    if (nombre && btnLogout) {
      btnLogout.textContent = `Cerrar sesion (${nombre})`;
    }
  }

  btnLogout?.addEventListener("click", cerrarSesion);
}

document.addEventListener("DOMContentLoaded", configurarNavbar);
