package com.tuapp.reservasturismo.repository;

import com.tuapp.reservasturismo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoriaId(Long categoriaId);

    @Transactional
    void deleteByCategoriaId(Long categoriaId);
}