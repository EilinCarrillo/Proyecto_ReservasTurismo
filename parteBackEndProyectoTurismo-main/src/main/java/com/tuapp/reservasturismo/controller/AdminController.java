package com.tuapp.reservasturismo.controller;

import com.tuapp.reservasturismo.model.Categoria;
import com.tuapp.reservasturismo.model.Producto;
import com.tuapp.reservasturismo.repository.CategoriaRepository;
import com.tuapp.reservasturismo.repository.ProductoRepository;
import com.tuapp.reservasturismo.repository.UsuarioRepository;
import com.tuapp.reservasturismo.model.Usuario;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public AdminController(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // =========================
    // IDENTIFICAR ADMIN
    // =========================

    @GetMapping("/usuarios/{id}")
    public Usuario obtenerUsuario(
            @PathVariable Long id
    ) {
        return usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));
    }

    // =========================
    // LISTAR PRODUCTOS
    // =========================

    @GetMapping("/productos")
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // =========================
    // CREAR PRODUCTO
    // =========================

    @PostMapping("/productos")
    public Producto crearProducto(
            @RequestBody Producto producto
    ) {
        return productoRepository.save(producto);
    }

    // =========================
    // ELIMINAR PRODUCTO
    // =========================

    @DeleteMapping("/productos/{id}")
    public String eliminarProducto(
            @PathVariable Long id
    ) {

        productoRepository.deleteById(id);

        return "Producto eliminado";
    }

    // =========================
    // FILTRAR POR CATEGORIA
    // =========================

    @GetMapping("/productos/categoria/{id}")
    public List<Producto> listarPorCategoria(
            @PathVariable Long id
    ) {
        return productoRepository.findByCategoriaId(id);
    }

    // =========================
    // AGREGAR CATEGORIA
    // =========================

    @PostMapping("/categorias")
    public Categoria crearCategoria(
            @RequestBody Categoria categoria
    ) {
        return categoriaRepository.save(categoria);
    }

    // =========================
    // ELIMINAR CATEGORIA
    // =========================

    @DeleteMapping("/categorias/{id}")
    public String eliminarCategoria(
            @PathVariable Long id
    ) {

        categoriaRepository.deleteById(id);

        return "Categoria eliminada";
    }

}