package com.lingoshelf.proyecto.dto;

public record TranslationResponse(
    String languageCode,
    String title,
    String description,
    String cefrLevel
) {}
