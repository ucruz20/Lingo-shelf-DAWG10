package com.lingoshelf.proyecto.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BookResponse", description = "Respuesta resumida de un libro")
public record BookResponse(
    Long id,
    String isbn,
    String author,
    String category,
    BigDecimal price,
    LocalDate publishedDate,
    List<TranslationResponse> translations
) {}
