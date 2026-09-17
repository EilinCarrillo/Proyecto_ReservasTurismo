package com.tuapp.reservasturismo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // DESPUÉS
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad_personas")
    private int cantidadPersonas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default                                  // ← línea agregada
    private EstadoReserva estado = EstadoReserva.ACTIVA;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }

    public enum EstadoReserva {
        ACTIVA, CANCELADA
    }
}