package com.lingoshelf.proyecto.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.lingoshelf.proyecto.dto.BookRequest;
import com.lingoshelf.proyecto.dto.BookResponse;
import com.lingoshelf.proyecto.services.BookService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/books")
@Tag(name = "Books", description = "Operaciones para buscar, crear, actualizar y eliminar libros")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/search")
    @Operation(
        summary = "Buscar libros por titulo",
        description = "Busca libros por titulo y devuelve la traduccion mas adecuada segun el encabezado Accept-Language."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de libros encontrada"),
        @ApiResponse(responseCode = "400", description = "Parametros invalidos")
    })
    public ResponseEntity<List<BookResponse>> search(
        @Parameter(description = "Titulo o parte del titulo a buscar", example = "Cien anos de soledad")
        @RequestParam String title,
        @Parameter(description = "Idioma preferido de respuesta", example = "es")
        @RequestHeader(name = "Accept-Language", defaultValue = "es") String lang) {

        String languageCode = lang.length() >= 2 ? lang.substring(0, 2) : lang;
        return ResponseEntity.ok(bookService.searchBooks(title, languageCode));
    }

    @PostMapping("/create")
    @Operation(summary = "Crear un libro", description = "Crea un libro junto con sus traducciones.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Libro creado correctamente"),
        @ApiResponse(
            responseCode = "400",
            description = "Cuerpo de solicitud invalido",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = "{\"isbn\":\"9781234567890\",\"price\":19.99,\"mcer\":\"B2\",\"category\":\"Novela\",\"title\":\"Libro base\",\"translations\":[{\"languageCode\":\"es\",\"title\":\"Libro base\",\"description\":\"Descripcion en espanol\"}]}"
                )
            )
        )
    })
    public ResponseEntity<BookResponse> create(@RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.createBook(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un libro", description = "Actualiza los datos base y las traducciones del libro.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Libro actualizado"),
        @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    })
    public ResponseEntity<BookResponse> update(@PathVariable Long id, @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un libro", description = "Elimina un libro por su identificador.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Libro eliminado"),
        @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    
    
}
