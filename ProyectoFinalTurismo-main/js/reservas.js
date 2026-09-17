const form = document.getElementById("formReserva");
const tabla = document.getElementById("tablaReservas");

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function mostrarReservas() {

    tabla.innerHTML = "";

    reservas.forEach((reserva, index) => {

        tabla.innerHTML += `
        <tr>
            <td>${reserva.nombre}</td>
            <td>${reserva.destino}</td>
            <td>
                <button onclick="eliminarReserva(${index})">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

form.addEventListener("submit", function(e){

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const destino = document.getElementById("destino").value;

    if(nombre.trim() === "" || destino.trim() === ""){
    alert("Por favor complete todos los campos");
    return;
}

    reservas.push({nombre, destino});

    localStorage.setItem("reservas", JSON.stringify(reservas));
    
    alert("Reserva guardada correctamente");

    mostrarReservas();

    form.reset();
});

function eliminarReserva(index){

    const confirmar = confirm("¿Seguro que deseas eliminar esta reserva?");

    if(!confirmar){
        return;
    }

    reservas.splice(index,1);

    localStorage.setItem("reservas", JSON.stringify(reservas));

    mostrarReservas();
}

mostrarReservas();