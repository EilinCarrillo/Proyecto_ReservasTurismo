package com.tuapp.reservasturismo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    @JsonIgnore  // nunca exponer el password en la API
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.USER;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // evita referencia circular Usuario → Reserva → Usuario
    private List<Reserva> reservas;

    @PrePersist
    public void prePersist() {
        this.creadoEn = LocalDateTime.now();
    }

    public enum Rol {
        ADMIN, USER
    }
}