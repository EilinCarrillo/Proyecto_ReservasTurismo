package com.tuapp.reservasturismo.service.impl;

import com.tuapp.reservasturismo.dto.LoginRequestDTO;
import com.tuapp.reservasturismo.dto.LoginResponseDTO;
import com.tuapp.reservasturismo.dto.UsuarioRequestDTO;
import com.tuapp.reservasturismo.dto.UsuarioResponseDTO;
import com.tuapp.reservasturismo.model.Usuario;
import com.tuapp.reservasturismo.repository.UsuarioRepository;
import com.tuapp.reservasturismo.service.UsuarioService;
import com.tuapp.reservasturismo.session.SesionManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repo;
    private final BCryptPasswordEncoder encoder;
    private final SesionManager sesionManager;

    public UsuarioServiceImpl(UsuarioRepository repo,
                              BCryptPasswordEncoder encoder,
                              SesionManager sesionManager) {
        this.repo = repo;
        this.encoder = encoder;
        this.sesionManager = sesionManager;
    }

    @Override
    public UsuarioResponseDTO crear(UsuarioRequestDTO dto) {
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya existe");
        }
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(encoder.encode(dto.getPassword()));
        usuario.setRol(dto.getRol() != null
                ? Usuario.Rol.valueOf(dto.getRol().toUpperCase())
                : Usuario.Rol.USER);
        return mapToDTO(repo.save(usuario));
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        if (repo.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + usuario.getEmail());
        }
        if (repo.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("Ya existe un usuario con el username: " + usuario.getUsername());
        }
        if (usuario.getRol() == null) {
            usuario.setRol(Usuario.Rol.USER);
        }
        return repo.save(usuario);
    }

    @Override
    public List<Usuario> listarUsuarios() {
        return repo.findAll();
    }

    @Override
    public Usuario buscarPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    @Override
    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        Usuario existente = buscarPorId(id);
        existente.setUsername(usuario.getUsername());
        existente.setEmail(usuario.getEmail());
        if (usuario.getRol() != null) {
            existente.setRol(usuario.getRol());
        }
        return repo.save(existente);
    }

    @Override
    public void eliminarUsuario(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("El email es obligatorio.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("La contrasena es obligatoria.");
        }
        Optional<Usuario> optUsuario = repo.findByEmail(request.getEmail());
        if (optUsuario.isEmpty()) {
            throw new RuntimeException("No existe ninguna cuenta con ese email.");
        }
        Usuario usuario = optUsuario.get();
        if (!encoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contrasena incorrecta.");
        }
        String token = sesionManager.crearSesion(usuario);
        return new LoginResponseDTO(
                "Bienvenido, " + usuario.getUsername() + "!",
                token,
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getRol().name()
        );
    }

    @Override
    public void logout(String token) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Token de sesion no proporcionado.");
        }
        if (sesionManager.obtenerUsuario(token) == null) {
            throw new RuntimeException("La sesion no existe o ya fue cerrada.");
        }
        sesionManager.cerrarSesion(token);
    }

    @Override
    public Usuario cambiarRol(Long idObjetivo, String nuevoRol, String tokenAdmin) {

        Usuario objetivo = buscarPorId(idObjetivo);

        if (nuevoRol == null ||
                (!nuevoRol.equalsIgnoreCase("ADMIN")
                        && !nuevoRol.equalsIgnoreCase("USER"))) {

            throw new RuntimeException(
                    "Rol invalido. Los valores permitidos son: ADMIN, USER."
            );
        }

        objetivo.setRol(
                Usuario.Rol.valueOf(nuevoRol.toUpperCase())
        );

        return repo.save(objetivo);
    }

    private UsuarioResponseDTO mapToDTO(Usuario u) {
        return new UsuarioResponseDTO(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getRol().name()
        );
    }
}