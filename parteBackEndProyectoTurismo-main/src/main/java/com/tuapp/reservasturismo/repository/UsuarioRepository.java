package com.tuapp.reservasturismo.repository;

import com.tuapp.reservasturismo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}