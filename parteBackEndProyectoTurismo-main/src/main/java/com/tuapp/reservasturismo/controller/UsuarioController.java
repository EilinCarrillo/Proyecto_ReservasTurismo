package com.tuapp.reservasturismo.controller;

import com.tuapp.reservasturismo.dto.RolRequestDTO;
import com.tuapp.reservasturismo.model.Usuario;
import com.tuapp.reservasturismo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario usuario) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(usuarioService.crearUsuario(usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @RequestBody Usuario usuario) {
        try {
            return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/rol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarRol(
            @PathVariable Long id,
            @RequestBody RolRequestDTO request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        try {
            String token = extraerToken(authHeader);

            Usuario actualizado = usuarioService.cambiarRol(
                    id,
                    request.getRol(),
                    token
            );

            String accion = "ADMIN".equalsIgnoreCase(actualizado.getRol().name())
                    ? "Rol de administrador asignado correctamente."
                    : "Rol de administrador removido correctamente.";

            return ResponseEntity.ok(Map.of(
                    "mensaje", accion,
                    "usuario", actualizado
            ));

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private String extraerToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token de sesión no proporcionado.");
        }
        return authHeader.substring(7).trim();
    }
}