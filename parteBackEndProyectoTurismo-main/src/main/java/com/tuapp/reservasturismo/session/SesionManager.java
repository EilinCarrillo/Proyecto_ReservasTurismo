package com.tuapp.reservasturismo.session;

import com.tuapp.reservasturismo.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Gestor de sesiones en memoria.
 * En producción real se reemplazaría por JWT o Spring Security.
 */
@Component
public class SesionManager {

    // token -> usuario
    private final Map<String, Usuario> sesiones = new ConcurrentHashMap<>();

    /** Crea un token único para el usuario y lo guarda. */
    public String crearSesion(Usuario usuario) {
        String token = UUID.randomUUID().toString();
        sesiones.put(token, usuario);
        return token;
    }

    /** Retorna el usuario asociado al token, o null si no existe/expiró. */
    public Usuario obtenerUsuario(String token) {
        if (token == null || token.isBlank()) return null;
        return sesiones.get(token);
    }

    /** Elimina la sesión (logout). */
    public void cerrarSesion(String token) {
        sesiones.remove(token);
    }

    /** Verifica si el token pertenece a un admin. */
    public boolean esAdmin(String token) {
        Usuario u = obtenerUsuario(token);
        return u != null && u.getRol() == Usuario.Rol.ADMIN;
    }

    /** Actualiza el usuario en la sesión activa (por si cambió el rol). */
    public void actualizarSesion(String token, Usuario usuarioActualizado) {
        if (sesiones.containsKey(token)) {
            sesiones.put(token, usuarioActualizado);
        }
    }
}