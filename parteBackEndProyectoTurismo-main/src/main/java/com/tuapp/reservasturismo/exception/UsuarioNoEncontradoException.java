// Archivo: src/main/java/com/tuapp/reservasturismo/exception/UsuarioNoEncontradoException.java

package com.tuapp.reservasturismo.exception;

public class UsuarioNoEncontradoException extends ReservaException {
    public UsuarioNoEncontradoException(Long id) {
        super("Usuario no encontrado con ID: " + id, "USUARIO_NO_ENCONTRADO");
    }
}