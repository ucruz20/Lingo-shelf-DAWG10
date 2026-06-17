package com.lingoshelf.proyecto.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "BookRequest", description = "Datos necesarios para crear o actualizar un libro")
public class BookRequest {

    @Schema(description = "Codigo ISBN del libro", example = "9780060929794")
    private String isbn;
    @Schema(description = "Precio del libro", example = "19.99")
    private BigDecimal price;
    @Schema(description = "Nombre del autor", example = "Gabriel García Márquez")
    private String author;
    @Schema(description = "Categoria del libro", example = "Novela")
    private String category;
    @Schema(description = "Fecha de Publicación del libro original", example = "1967-06-05")
    private LocalDate publishedDate;
    @ArraySchema(schema = @Schema(implementation = BookTranslationRequest.class),
            arraySchema = @Schema(description = "Listado de traducciones del libro"))
    private List<BookTranslationRequest> translations;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "BookTranslationRequest", description = "Informacion traducida del libro")
    public static class BookTranslationRequest {
        @Schema(description = "Codigo ISO del idioma", example = "es")
        private String languageCode;
        @Schema(description = "Titulo traducido", example = "Cien anos de soledad")
        private String title;
        @Schema(description = "Descripcion traducida", example = "Descripcion breve del libro")
        private String description;
        @Schema(description = "Nivel CEFR", example = "B2")
        private String cefrLevel;
    }
}
