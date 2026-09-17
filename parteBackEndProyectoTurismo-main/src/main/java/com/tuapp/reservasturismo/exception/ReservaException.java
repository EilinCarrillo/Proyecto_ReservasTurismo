// Archivo: src/main/java/com/tuapp/reservasturismo/exception/ReservaException.java

package com.tuapp.reservasturismo.exception;

public class ReservaException extends RuntimeException {
    private String codigo;

    public ReservaException(String mensaje, String codigo) {
        super(mensaje);
        this.codigo = codigo;
    }

    public ReservaException(String mensaje, String codigo, Throwable causa) {
        super(mensaje, causa);
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }
}