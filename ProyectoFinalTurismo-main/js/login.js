// login.js — Integrado con backend Spring Boot

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================================================================
// REGISTRO
// ================================================================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nombre = document.getElementById("regNombre").value.trim();
    const email  = document.getElementById("regEmail").value.trim();
    const pass   = document.getElementById("regPass").value.trim();
    const msg    = document.getElementById("registerMsg");

    if (!nombre || !email || !pass) {
      msg.innerHTML = "<span class='text-danger'>Todos los campos son obligatorios</span>";
      return;
    }
    if (!validarEmail(email)) {
      msg.innerHTML = "<span class='text-danger'>Ingresa un correo válido</span>";
      return;
    }
    if (pass.length < 6) {
      msg.innerHTML = "<span class='text-danger'>La contraseña debe tener al menos 6 caracteres</span>";
      return;
    }

    msg.innerHTML = "<span class='text-muted'>Registrando...</span>";
    try {
      await apiRegister(nombre, email, pass);
      const loginData = await apiLogin(email, pass);
      procesarLoginExitoso(loginData, nombre);
      msg.innerHTML = "<span class='text-success'>Cuenta creada. Redirigiendo...</span>";
      setTimeout(() => window.location.href = "index.html", 1000);
    } catch (err) {
      msg.innerHTML = `<span class='text-danger'>${err.message}</span>`;
    }
  });
}

// ================================================================
// LOGIN
// ================================================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass  = document.getElementById("loginPass").value.trim();
    const msg   = document.getElementById("loginMsg");

    if (!email || !pass) {
      msg.innerHTML = "<span class='text-danger'>Todos los campos son obligatorios</span>";
      return;
    }

    msg.innerHTML = "<span class='text-muted'>Iniciando sesión...</span>";
    try {
      const loginData = await apiLogin(email, pass);
      procesarLoginExitoso(loginData, null);
      msg.innerHTML = "<span class='text-success'>¡Bienvenido! Redirigiendo...</span>";
      setTimeout(() => {
        window.location.href = esAdmin() ? "admin.html" : "index.html";
      }, 800);
    } catch (err) {
      msg.innerHTML = `<span class='text-danger'>${err.message || "Correo o contraseña incorrectos"}</span>`;
    }
  });
}

// ================================================================
// Procesar respuesta del login — guarda token, userId, rol
// ================================================================
function procesarLoginExitoso(loginData, nombreFallback) {
  const token    = loginData.token;
  const userId   = loginData.userId;       // ← ahora el back lo devuelve
  const username = loginData.username;     // ← y el username también
  const rol      = loginData.rol || "USER";

  // Fallback: si por alguna razón no viene userId, intentar del JWT
  let idFinal = userId;
  if (!idFinal) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      idFinal = payload.userId || payload.id || null;
    } catch (_) {}
  }

  guardarSesionLocal(token, username || nombreFallback, rol, idFinal, username);
}