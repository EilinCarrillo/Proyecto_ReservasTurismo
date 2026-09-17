package com.tuapp.reservasturismo.controller;

import com.tuapp.reservasturismo.model.Categoria;
import com.tuapp.reservasturismo.model.Producto;
import com.tuapp.reservasturismo.repository.CaracteristicaRepository;
import com.tuapp.reservasturismo.repository.CategoriaRepository;
import com.tuapp.reservasturismo.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaRepository repo;
    private final ProductoRepository productoRepo;
    private final CaracteristicaRepository caracteristicaRepo;

    public CategoriaController(CategoriaRepository repo,
                               ProductoRepository productoRepo,
                               CaracteristicaRepository caracteristicaRepo) {
        this.repo = repo;
        this.productoRepo = productoRepo;
        this.caracteristicaRepo = caracteristicaRepo;
    }

    @GetMapping
    public List<Categoria> listar() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, String> body) {
        String nombre = body.get("nombre");
        if (nombre == null || nombre.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre es obligatorio"));
        }
        if (repo.existsByNombre(nombre)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Ya existe una categoria con ese nombre"));
        }
        Categoria nueva = new Categoria();
        nueva.setNombre(nombre);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(nueva));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Categoria no encontrada"));
        }
        List<Producto> productos = productoRepo.findByCategoriaId(id);
        for (Producto p : productos) {
            caracteristicaRepo.deleteByProductoId(p.getId());
        }
        productoRepo.deleteByCategoriaId(id);
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Categoria eliminada"));
    }
}