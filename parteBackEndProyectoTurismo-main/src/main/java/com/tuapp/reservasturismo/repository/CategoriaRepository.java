package com.tuapp.reservasturismo.repository;

import com.tuapp.reservasturismo.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNombre(String nombre);
}