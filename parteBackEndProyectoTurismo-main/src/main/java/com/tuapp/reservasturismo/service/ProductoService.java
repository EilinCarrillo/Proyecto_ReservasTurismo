package com.tuapp.reservasturismo.service;
import com.tuapp.reservasturismo.dto.ProductoRequestDTO;
import com.tuapp.reservasturismo.dto.ProductoResponseDTO;
import java.util.List;
public interface ProductoService {
    ProductoResponseDTO crear(ProductoRequestDTO dto);
    List<ProductoResponseDTO> listar();
    ProductoResponseDTO editar(Long id, ProductoRequestDTO dto);
    void eliminar(Long id);
    List<ProductoResponseDTO> filtrarPorCategoria(Long categoriaId);
}