package com.tuapp.reservasturismo.controller;
import com.tuapp.reservasturismo.dto.ProductoRequestDTO;
import com.tuapp.reservasturismo.dto.ProductoResponseDTO;
import com.tuapp.reservasturismo.service.ProductoService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;



@RestController
@RequestMapping("/productos")
public class ProductoController {
    private final ProductoService productoService;
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }
    @PostMapping
    public ProductoResponseDTO crear(@RequestBody ProductoRequestDTO dto) {
        return productoService.crear(dto);
    }

    @GetMapping
    public List<ProductoResponseDTO> listar() {
        return productoService.listar();
    }
    @PutMapping("/{id}")
    public ProductoResponseDTO editar(@PathVariable Long id,
                                      @RequestBody ProductoRequestDTO dto) {
        return productoService.editar(id, dto);
    }
    // DESPUÉS
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado"));
    }
    @GetMapping("/categoria/{categoriaId}")
    public List<ProductoResponseDTO> filtrarPorCategoria(@PathVariable Long
                                                                 categoriaId) {
        return productoService.filtrarPorCategoria(categoriaId);
    }

}