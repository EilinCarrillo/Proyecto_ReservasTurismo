package com.tuapp.reservasturismo.service.impl;

import com.tuapp.reservasturismo.dto.ReservaRequestDTO;
import com.tuapp.reservasturismo.dto.ReservaResponseDTO;
import com.tuapp.reservasturismo.exception.ReservaException;
import com.tuapp.reservasturismo.factory.ReservaFactory;
import com.tuapp.reservasturismo.model.Producto;
import com.tuapp.reservasturismo.model.Reserva;
import com.tuapp.reservasturismo.model.Usuario;
import com.tuapp.reservasturismo.repository.ProductoRepository;
import com.tuapp.reservasturismo.repository.ReservaRepository;
import com.tuapp.reservasturismo.repository.UsuarioRepository;
import com.tuapp.reservasturismo.service.ReservaService;
import com.tuapp.reservasturismo.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final EmailService emailService;

    // ── Crear reserva ────────────────────────────────────────────────────────
    @Override
    @Transactional
    public ReservaResponseDTO crearReserva(ReservaRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ReservaException(
                        "Usuario no encontrado con id: " + dto.getUsuarioId(),
                        "USUARIO_NO_ENCONTRADO"));

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new ReservaException(
                        "Producto no encontrado con id: " + dto.getProductoId(),
                        "PRODUCTO_NO_ENCONTRADO"));

        Reserva reserva = ReservaFactory.crear(usuario, producto, dto.getCantidadPersonas());
        Reserva guardada = reservaRepository.save(reserva);

        emailService.enviarConfirmacionReserva(usuario, guardada);

        return toDTO(guardada);
    }

    // ── Listar todas ─────────────────────────────────────────────────────────
    @Override
    public List<ReservaResponseDTO> listarReservas() {
        return reservaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Buscar por id ─────────────────────────────────────────────────────────
    @Override
    public ReservaResponseDTO buscarPorId(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ReservaException(
                        "Reserva no encontrada con id: " + id,
                        "RESERVA_NO_ENCONTRADA"));
        return toDTO(reserva);
    }

    // ── Filtrar por usuario ───────────────────────────────────────────────────
    @Override
    public List<ReservaResponseDTO> filtrarPorUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ReservaException(
                    "Usuario no encontrado con id: " + usuarioId,
                    "USUARIO_NO_ENCONTRADO");
        }
        return reservaRepository.findByUsuarioId(usuarioId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Filtrar por producto ──────────────────────────────────────────────────
    @Override
    public List<ReservaResponseDTO> filtrarPorProducto(Long productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw new ReservaException(
                    "Producto no encontrado con id: " + productoId,
                    "PRODUCTO_NO_ENCONTRADO");
        }
        return reservaRepository.findByProductoId(productoId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Filtrar por estado ────────────────────────────────────────────────────
    @Override
    public List<ReservaResponseDTO> filtrarPorEstado(String estado) {
        Reserva.EstadoReserva estadoEnum;
        try {
            estadoEnum = Reserva.EstadoReserva.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ReservaException(
                    "Estado inválido: '" + estado + "'. Use ACTIVA o CANCELADA.",
                    "ESTADO_INVALIDO");
        }
        return reservaRepository.findByEstado(estadoEnum)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Cancelar reserva ──────────────────────────────────────────────────────
    @Override
    @Transactional
    public ReservaResponseDTO cancelarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ReservaException(
                        "Reserva no encontrada con id: " + id,
                        "RESERVA_NO_ENCONTRADA"));

        if (reserva.getEstado() == Reserva.EstadoReserva.CANCELADA) {
            throw new ReservaException(
                    "La reserva con id " + id + " ya está cancelada.",
                    "RESERVA_YA_CANCELADA");
        }

        reserva.setEstado(Reserva.EstadoReserva.CANCELADA);
        return toDTO(reservaRepository.save(reserva));
    }

    // ── Eliminar reserva ──────────────────────────────────────────────────────
    @Override
    @Transactional
    public void eliminarReserva(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new ReservaException(
                    "Reserva no encontrada con id: " + id,
                    "RESERVA_NO_ENCONTRADA");
        }
        reservaRepository.deleteById(id);
    }

    // ── Mapper interno ────────────────────────────────────────────────────────
    private ReservaResponseDTO toDTO(Reserva r) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setId(r.getId());
        dto.setCantidadPersonas(r.getCantidadPersonas());
        dto.setEstado(r.getEstado().name());
        dto.setFecha(r.getFecha());

        if (r.getUsuario() != null) {
            ReservaResponseDTO.UsuarioResumen u = new ReservaResponseDTO.UsuarioResumen(
                    r.getUsuario().getId(),
                    r.getUsuario().getUsername(),
                    r.getUsuario().getEmail()
            );
            dto.setUsuario(u);
        }

        if (r.getProducto() != null) {
            ReservaResponseDTO.ProductoResumen p = new ReservaResponseDTO.ProductoResumen(
                    r.getProducto().getId(),
                    r.getProducto().getNombre(),
                    r.getProducto().getDescripcion()
            );
            dto.setProducto(p);
        }

        return dto;
    }
}