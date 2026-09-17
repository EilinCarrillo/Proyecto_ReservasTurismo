package com.tuapp.reservasturismo.repository;

import com.tuapp.reservasturismo.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long usuarioId);
    List<Reserva> findByProductoId(Long productoId);
    List<Reserva> findByEstado(Reserva.EstadoReserva estado);
}