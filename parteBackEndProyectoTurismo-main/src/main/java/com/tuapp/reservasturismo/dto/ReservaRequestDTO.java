// Archivo: src/main/java/com/tuapp/reservasturismo/dto/ReservaRequestDTO.java

package com.tuapp.reservasturismo.dto;

import jakarta.validation.constraints.*;

public class ReservaRequestDTO {

    @NotNull(message = "El ID del usuario no puede ser nulo")
    private Long usuarioId;

    @NotNull(message = "El ID del producto no puede ser nulo")
    private Long productoId;

    @NotNull(message = "La cantidad de personas no puede ser nula")
    @Min(value = 1, message = "Debe haber al menos 1 persona")
    @Max(value = 20, message = "Máximo 20 personas por reserva")
    private Integer cantidadPersonas;

    // Getters y Setters
    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidadPersonas() {
        return cantidadPersonas;
    }

    public void setCantidadPersonas(Integer cantidadPersonas) {
        this.cantidadPersonas = cantidadPersonas;
    }
}