package com.tuapp.reservasturismo.service;

import com.tuapp.reservasturismo.dto.LoginRequestDTO;
import com.tuapp.reservasturismo.dto.LoginResponseDTO;
import com.tuapp.reservasturismo.dto.UsuarioRequestDTO;
import com.tuapp.reservasturismo.dto.UsuarioResponseDTO;
import com.tuapp.reservasturismo.model.Usuario;
import java.util.List;

public interface UsuarioService {
    Usuario crearUsuario(Usuario usuario);
    UsuarioResponseDTO crear(UsuarioRequestDTO dto);
    List<Usuario> listarUsuarios();
    Usuario buscarPorId(Long id);
    Usuario actualizarUsuario(Long id, Usuario usuario);
    void eliminarUsuario(Long id);
    LoginResponseDTO login(LoginRequestDTO request);
    void logout(String token);
    Usuario cambiarRol(Long idUsuarioObjetivo, String nuevoRol, String tokenAdmin);
}