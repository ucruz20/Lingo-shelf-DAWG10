package com.lingoshelf.proyecto.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BookResponse", description = "Respuesta resumida de un libro")
public record BookResponse(Long id, String title, Double price) {
}
