package com.tuapp.reservasturismo.service;

import com.tuapp.reservasturismo.dto.ReservaRequestDTO;
import com.tuapp.reservasturismo.dto.ReservaResponseDTO;
import java.util.List;

public interface ReservaService {

    ReservaResponseDTO crearReserva(ReservaRequestDTO dto);

    List<ReservaResponseDTO> listarReservas();

    ReservaResponseDTO buscarPorId(Long id);

    List<ReservaResponseDTO> filtrarPorUsuario(Long usuarioId);

    List<ReservaResponseDTO> filtrarPorProducto(Long productoId);

    List<ReservaResponseDTO> filtrarPorEstado(String estado);

    ReservaResponseDTO cancelarReserva(Long id);

    void eliminarReserva(Long id);
}