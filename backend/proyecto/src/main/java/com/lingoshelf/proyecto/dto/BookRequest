package com.lingoshelf.proyecto.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {

    private String isbn;
    private Double price;
    private String mcer;
    private String category;
    private String title;
    private List<BookTranslationRequest> translations;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookTranslationRequest {
        private String languageCode;
        private String title;
        private String description;
    }
}
