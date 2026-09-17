package com.tuapp.reservasturismo.service;
import com.tuapp.reservasturismo.dto.CategoriaRequestDTO;

import com.tuapp.reservasturismo.dto.CategoriaResponseDTO;
import java.util.List;
public interface CategoriaService {
    CategoriaResponseDTO crear(CategoriaRequestDTO dto);
    List<CategoriaResponseDTO> listar();
}