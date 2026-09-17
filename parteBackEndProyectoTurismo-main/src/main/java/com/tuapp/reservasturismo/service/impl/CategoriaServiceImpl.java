package com.tuapp.reservasturismo.service.impl;
import com.tuapp.reservasturismo.dto.CategoriaRequestDTO;
import com.tuapp.reservasturismo.dto.CategoriaResponseDTO;
import com.tuapp.reservasturismo.model.Categoria;
import com.tuapp.reservasturismo.repository.CategoriaRepository;
import com.tuapp.reservasturismo.service.CategoriaService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class CategoriaServiceImpl implements CategoriaService {
    private final CategoriaRepository categoriaRepository;
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }
    @Override
    public CategoriaResponseDTO crear(CategoriaRequestDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());

        Categoria guardada = categoriaRepository.save(categoria);
        return new CategoriaResponseDTO(
                guardada.getId(),
                guardada.getNombre()
        );
    }
    @Override
    public List<CategoriaResponseDTO> listar() {
        return categoriaRepository.findAll()
                .stream()
                .map(c -> new CategoriaResponseDTO(c.getId(), c.getNombre()))
                .collect(Collectors.toList());
    }
}