package com.tuapp.reservasturismo.controller;

import com.tuapp.reservasturismo.dto.ReservaRequestDTO;
import com.tuapp.reservasturismo.dto.ReservaResponseDTO;
import com.tuapp.reservasturismo.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    // ── POST /api/reservas → crear reserva ───────────────────────────────────
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crear(@Valid @RequestBody ReservaRequestDTO dto) {
        ReservaResponseDTO creada = reservaService.crearReserva(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // ── GET /api/reservas → listar todas (solo ADMIN) ─────────────────────────
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservaResponseDTO>> listar() {
        return ResponseEntity.ok(reservaService.listarReservas());
    }

    // ── GET /api/reservas/{id} → buscar por id ────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.buscarPorId(id));
    }

    // ── PATCH /api/reservas/{id}/cancelar → cancelar reserva ─────────────────
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ReservaResponseDTO> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.cancelarReserva(id));
    }

    // ── DELETE /api/reservas/{id} → eliminar reserva (solo ADMIN) ─────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
        return ResponseEntity.noContent().build();
    }

    // ── GET /api/reservas/filtrar/usuario/{usuarioId} ─────────────────────────
    @GetMapping("/filtrar/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponseDTO>> filtrarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.filtrarPorUsuario(usuarioId));
    }

    // ── GET /api/reservas/filtrar/producto/{productoId} ───────────────────────
    @GetMapping("/filtrar/producto/{productoId}")
    public ResponseEntity<List<ReservaResponseDTO>> filtrarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(reservaService.filtrarPorProducto(productoId));
    }

    // ── GET /api/reservas/filtrar/estado/{estado} ─────────────────────────────
    @GetMapping("/filtrar/estado/{estado}")
    public ResponseEntity<List<ReservaResponseDTO>> filtrarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(reservaService.filtrarPorEstado(estado));
    }
}