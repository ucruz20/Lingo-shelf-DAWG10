package com.lingoshelf.proyecto.dto;

<<<<<<< HEAD
=======
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "BookResponse", description = "Respuesta resumida de un libro")
>>>>>>> ff25157f6ba6e728615e27b4fbabccabfbf1977a
public record BookResponse(Long id, String title, Double price) {
}
