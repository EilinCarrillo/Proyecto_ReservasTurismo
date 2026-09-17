package com.tuapp.reservasturismo.dto;

public class ProductoResponseDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen;
    private String caracteristicas;
    private String categoria;
    private String categoriaNombre; // alias que usa el frontend

    public ProductoResponseDTO() {}

    public ProductoResponseDTO(Long id, String nombre, String descripcion,
                               Double precio, String caracteristicas, String categoria) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.caracteristicas = caracteristicas;
        this.categoria = categoria;
        this.categoriaNombre = categoria; // mismo valor, dos nombres
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
    public void setCaracteristicas(String c) { this.caracteristicas = c; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getCategoriaNombre() { return categoriaNombre; }
    public void setCategoriaNombre(String n) { this.categoriaNombre = n; }
}