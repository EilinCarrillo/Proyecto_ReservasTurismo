package com.tuapp.reservasturismo.repository;

import com.tuapp.reservasturismo.model.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Long> {
    List<Caracteristica> findByProductoId(Long productoId);

    @Transactional
    void deleteByProductoId(Long productoId);
}