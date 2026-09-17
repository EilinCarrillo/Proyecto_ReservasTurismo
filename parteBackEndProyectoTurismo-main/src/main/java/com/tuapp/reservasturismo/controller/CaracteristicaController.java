package com.tuapp.reservasturismo.controller;

import com.tuapp.reservasturismo.model.Caracteristica;
import com.tuapp.reservasturismo.model.Producto;
import com.tuapp.reservasturismo.repository.CaracteristicaRepository;
import com.tuapp.reservasturismo.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class CaracteristicaController {

    private final CaracteristicaRepository repo;
    private final ProductoRepository productoRepo;

    public CaracteristicaController(CaracteristicaRepository repo, ProductoRepository productoRepo) {
        this.repo = repo;
        this.productoRepo = productoRepo;
    }

    // GET /productos/{productoId}/caracteristicas
    @GetMapping("/productos/{productoId}/caracteristicas")
    public ResponseEntity<?> listarPorProducto(@PathVariable Long productoId) {
        if (!productoRepo.existsById(productoId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Producto no encontrado"));
        }
        return ResponseEntity.ok(repo.findByProductoId(productoId));
    }

    // POST /productos/{productoId}/caracteristicas
    @PostMapping("/productos/{productoId}/caracteristicas")
    public ResponseEntity<?> crear(@PathVariable Long productoId,
                                   @RequestBody Caracteristica datos) {
        Producto producto = productoRepo.findById(productoId).orElse(null);
        if (producto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Producto no encontrado"));
        }
        datos.setProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(datos));
    }

    // DELETE /productos/{productoId}/caracteristicas/{id}
    @DeleteMapping("/productos/{productoId}/caracteristicas/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long productoId,
                                      @PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Caracteristica no encontrada"));
        }
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Caracteristica eliminada"));
    }

    // DELETE /caracteristicas/{id}  (fallback que usa el frontend)
    @DeleteMapping("/caracteristicas/{id}")
    public ResponseEntity<?> eliminarDirecto(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Caracteristica no encontrada"));
        }
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Caracteristica eliminada"));
    }
}