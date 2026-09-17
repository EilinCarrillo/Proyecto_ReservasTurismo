package com.tuapp.reservasturismo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class ReservaResponseDTO {

    private Long id;

    @JsonProperty("usuario")
    private UsuarioResumen usuario;

    @JsonProperty("producto")
    private ProductoResumen producto;

    @JsonProperty("cantidad_personas")
    private Integer cantidadPersonas;

    @JsonProperty("estado")
    private String estado;

    @JsonProperty("fecha_creacion")
    private LocalDateTime fecha;

    public ReservaResponseDTO() {}

    public ReservaResponseDTO(Long id, UsuarioResumen usuario, ProductoResumen producto,
                              Integer cantidadPersonas, String estado, LocalDateTime fecha) {
        this.id = id;
        this.usuario = usuario;
        this.producto = producto;
        this.cantidadPersonas = cantidadPersonas;
        this.estado = estado;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UsuarioResumen getUsuario() { return usuario; }
    public void setUsuario(UsuarioResumen usuario) { this.usuario = usuario; }
    public ProductoResumen getProducto() { return producto; }
    public void setProducto(ProductoResumen producto) { this.producto = producto; }
    public Integer getCantidadPersonas() { return cantidadPersonas; }
    public void setCantidadPersonas(Integer cantidadPersonas) { this.cantidadPersonas = cantidadPersonas; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    // ── Clases internas ──────────────────────────────────────────────────────

    public static class UsuarioResumen {
        private Long id;
        private String username;
        private String email;

        public UsuarioResumen() {}
        public UsuarioResumen(Long id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ProductoResumen {
        private Long id;
        private String nombre;
        private String descripcion;

        public ProductoResumen() {}
        public ProductoResumen(Long id, String nombre, String descripcion) {
            this.id = id;
            this.nombre = nombre;
            this.descripcion = descripcion;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    }
}
