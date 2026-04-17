package com.lingoshelf.proyecto.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BookResponse", description = "Respuesta resumida de un libro")
public record BookResponse(Long id, String title, String description, BigDecimal price) {
}
