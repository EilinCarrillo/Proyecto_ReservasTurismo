package com.tuapp.reservasturismo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;
    private Double precio;
    private String imagen;

    // caracteristicas como texto simple (compatible con el service existente)
    @Column(columnDefinition = "TEXT")
    private String caracteristicas;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    public Producto() {}

    // Constructor que usa el ProductoServiceImpl
    public Producto(Long id, String nombre, String descripcion,
                    Double precio, String caracteristicas, Categoria categoria) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.caracteristicas = caracteristicas;
        this.categoria = categoria;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public String getCaracteristicas() { return caracteristicas; }
    public void setCaracteristicas(String caracteristicas) { this.caracteristicas = caracteristicas; }
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}