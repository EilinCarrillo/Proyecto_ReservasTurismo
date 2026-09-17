package com.tuapp.reservasturismo.controller;

import com.tuapp.reservasturismo.dto.AuthRequestDTO;
import com.tuapp.reservasturismo.dto.AuthResponseDTO;
import com.tuapp.reservasturismo.dto.UsuarioRequestDTO;
import com.tuapp.reservasturismo.dto.UsuarioResponseDTO;
import com.tuapp.reservasturismo.model.Usuario;
import com.tuapp.reservasturismo.repository.UsuarioRepository;
import com.tuapp.reservasturismo.security.JwtService;
import com.tuapp.reservasturismo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder;

    public AuthenticationController(UsuarioService usuarioService,
                                    UsuarioRepository usuarioRepository,
                                    JwtService jwtService,
                                    BCryptPasswordEncoder encoder) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.encoder = encoder;
    }
    @GetMapping("/hash")
    public String generarHash(@RequestParam String pass) {
        return encoder.encode(pass);
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsuarioRequestDTO dto) {
        try {
            UsuarioResponseDTO nuevo = usuarioService.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO dto) {
        String emailOUsername = dto.getUsername();

        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(emailOUsername);
        if (optUsuario.isEmpty()) {
            optUsuario = usuarioRepository.findByUsername(emailOUsername);
        }

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No existe ninguna cuenta con ese correo"));
        }

        Usuario usuario = optUsuario.get();

        if (!encoder.matches(dto.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Contraseña incorrecta"));
        }

        String token = jwtService.generarToken(
                usuario.getEmail(),
                usuario.getRol().name()
        );

        // Ahora devuelve token + datos del usuario para que el front los guarde
        return ResponseEntity.ok(new AuthResponseDTO(
                token,
                usuario.getId(),
                usuario.getUsername(),
                usuario.getRol().name()
        ));
    }
}