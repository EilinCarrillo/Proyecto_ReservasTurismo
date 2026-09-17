// form.js — Reservas integradas con backend Spring Boot

// Cargar productos en el select al iniciar
async function cargarDestinos() {
  const select = document.getElementById("destino");
  try {
    const productos = await apiGetProductos();
    select.innerHTML = '<option value="">Selecciona un destino</option>';
    if (Array.isArray(productos)) {
      productos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nombre;
        select.appendChild(option);
      });
    }
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar destinos</option>';
  }
}

cargarDestinos();

// Submit del formulario
document.getElementById("formReserva").addEventListener("submit", async function (e) {
  e.preventDefault();
  limpiarMensajes();

  const nombre     = document.getElementById("nombre").value.trim();
  const email      = document.getElementById("email").value.trim();
  const productoId = document.getElementById("destino").value;
  const destinoTexto = document.getElementById("destino").selectedOptions[0]?.text || "";
  const fecha      = document.getElementById("fecha").value;
  const personas   = parseInt(document.getElementById("personas").value);

  let valido = true;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hoy = new Date().toISOString().split("T")[0];

  if (!nombre)   { mostrarError("errorNombre",  "El nombre es obligatorio"); valido = false; }
  if (!email)    { mostrarError("errorEmail",   "El correo es obligatorio"); valido = false; }
  else if (!regex.test(email)) { mostrarError("errorEmail", "Ingrese un correo válido"); valido = false; }
  if (!productoId) { mostrarError("errorDestino", "Selecciona un destino"); valido = false; }
  if (!fecha)    { mostrarError("errorFecha",   "Seleccione una fecha"); valido = false; }
  else if (fecha < hoy) { mostrarError("errorFecha", "La fecha no puede ser en el pasado"); valido = false; }
  if (!personas || isNaN(personas)) { mostrarError("errorPersonas", "Ingrese el número de personas"); valido = false; }
  // DESPUÉS
  else if (personas <= 0) { mostrarError("errorPersonas", "Debe ser mayor a 0"); valido = false; }
  else if (personas > 20) { mostrarError("errorPersonas", "Máximo 20 personas por reserva"); valido = false; }

  if (!valido) return;

  const exito = document.getElementById("mensajeExito");
  exito.className = "alert mt-3 text-center";
  exito.classList.remove("d-none");
  exito.innerText = "Enviando reserva...";

  try {
    const userId = localStorage.getItem("userId");

    if (userId && productoId) {
      const reservaBackend = await apiCrearReserva(parseInt(userId), parseInt(productoId), personas);

      guardarReservaLocal({
        id: reservaBackend?.id || null,
        nombre, email,
        destino: destinoTexto,
        fecha, personas,
        enBackend: true
      });

      exito.innerText = "✅ Reserva confirmada en el sistema.";
      exito.classList.add("alert-success");

    } else {
      guardarReservaLocal({ nombre, email, destino: destinoTexto, fecha, personas, enBackend: false });
      exito.innerText = "⚠️ Inicia sesión para confirmar tu reserva en el sistema.";
      exito.classList.add("alert-warning");
    }

    document.getElementById("formReserva").reset();
    cargarDestinos(); // restaurar el select
    mostrarReservas();
    setTimeout(() => { exito.classList.add("d-none"); }, 5000);

  } catch (err) {
    exito.innerText = "❌ Error al procesar la reserva: " + err.message;
    exito.classList.add("alert-danger");
  }
});

function guardarReservaLocal(reserva) {
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  if (el) el.innerText = mensaje;
}

function limpiarMensajes() {
  document.querySelectorAll("small[id^='error']").forEach(el => el.innerText = "");
  const exito = document.getElementById("mensajeExito");
  if (exito) {
    exito.classList.add("d-none");
    exito.innerText = "";
    exito.className = "alert mt-3 text-center d-none";
  }
}

function mostrarReservas() {
  const tabla    = document.getElementById("tablaReservas");
  const contenido = document.getElementById("contenidoTabla");
  if (!tabla || !contenido) return;

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  tabla.classList.remove("d-none");
  contenido.innerHTML = "";

  if (reservas.length === 0) {
    contenido.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay reservas registradas</td></tr>`;
    return;
  }

  reservas.forEach((reserva, index) => {
    contenido.innerHTML += `
      <tr>
        <td>${reserva.nombre}</td>
        <td>${reserva.email}</td>
        <td>${reserva.destino}</td>
        <td>${reserva.fecha}</td>
        <td>${reserva.personas}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

async function eliminarReserva(index) {
  if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const reserva = reservas[index];

  if (reserva?.enBackend && reserva?.id) {
    try {
      await apiEliminarReserva(reserva.id);
    } catch (err) {
      console.warn("No se pudo eliminar del backend:", err.message);
    }
  }

  reservas.splice(index, 1);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  mostrarReservas();
}