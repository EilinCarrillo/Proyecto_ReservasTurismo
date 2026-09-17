package com.tuapp.reservasturismo.controller;

import com.tuapp.reservasturismo.dto.LoginRequestDTO;
import com.tuapp.reservasturismo.dto.LoginResponseDTO;
import com.tuapp.reservasturismo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoints de autenticación:
 *   POST /api/auth/login   → iniciar sesión
 *   POST /api/auth/logout  → cerrar sesión
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Login.
     * Body: { "email": "...", "password": "..." }
     * Respuesta exitosa 200: { mensaje, token, usuarioId, nombre, email, rol, avatarUrl }
     * Respuesta error   401: { "error": "mensaje claro" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO response = usuarioService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Logout.
     * Header: Authorization: Bearer <token>
     * Respuesta 200: { "mensaje": "Sesión cerrada correctamente." }
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            String token = extraerToken(authHeader);
            usuarioService.logout(token);
            return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada correctamente."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** Extrae el token del header "Authorization: Bearer <token>" */
    private String extraerToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token de sesión no proporcionado.");
        }
        return authHeader.substring(7).trim();
    }
}