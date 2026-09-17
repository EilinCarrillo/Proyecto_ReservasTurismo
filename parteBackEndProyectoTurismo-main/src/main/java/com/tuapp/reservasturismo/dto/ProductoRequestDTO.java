package com.tuapp.reservasturismo.dto;

public class ProductoRequestDTO {

    private String nombre;
    private String descripcion;
    private Double precio;
    private String caracteristicas;
    private Long categoriaId;
    private String imagen;

    public ProductoRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Double getPrecio() {
        return precio;
    }

    public String getCaracteristicas() {
        return caracteristicas;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getImagen() {
        return imagen;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public void setCaracteristicas(String caracteristicas) {
        this.caracteristicas = caracteristicas;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}