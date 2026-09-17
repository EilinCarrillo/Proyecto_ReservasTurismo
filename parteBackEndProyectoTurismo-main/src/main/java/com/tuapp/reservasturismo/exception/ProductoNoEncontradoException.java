// Archivo: src/main/java/com/tuapp/reservasturismo/exception/ProductoNoEncontradoException.java

package com.tuapp.reservasturismo.exception;

public class ProductoNoEncontradoException extends ReservaException {
    public ProductoNoEncontradoException(Long id) {
        super("Producto no encontrado con ID: " + id, "PRODUCTO_NO_ENCONTRADO");
    }
}