package com.lingoshelf.proyecto.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.lingoshelf.proyecto.dto.BookRequest;
import com.lingoshelf.proyecto.dto.BookResponse;
import com.lingoshelf.proyecto.dto.TranslationResponse;
import com.lingoshelf.proyecto.entity.Book;
import com.lingoshelf.proyecto.entity.BookTranslation;
import com.lingoshelf.proyecto.repository.BookRepository;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<BookResponse> findAllBooks() {
        List<Book> books = bookRepository.findAll();

        return books.stream()
            .map(this::toBookResponse)
            .filter(java.util.Objects::nonNull)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookResponse> searchBooks(String title, String lang) {
        List<Book> books = bookRepository.findByTitleInAnyLanguage(title);
        return books.stream()
            .map(this::toBookResponse)
            .filter(java.util.Objects::nonNull)
            .collect(Collectors.toList());
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        if (request.getTranslations().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Libro debe contener por lo menos una traducción");
        }

        Book book = new Book();
        applyRequestToBook(book, request);

        Book savedBook = bookRepository.save(book);
        return toBookResponse(savedBook);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado"));

        applyRequestToBook(book, request);

        Book updatedBook = bookRepository.save(book);
        return toBookResponse(updatedBook);
    }

    @Transactional(readOnly = true)
    public Book getById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    @Transactional
    public void delete(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado"));

        try {
            bookRepository.delete(book);
            bookRepository.flush();
        } catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Libro no encontrado", ex);
        }
    }

    private void applyRequestToBook(Book book, BookRequest request) {
        book.setIsbn(request.getIsbn());
        book.setAuthor(request.getAuthor());
        book.setPublishedDate(request.getPublishedDate());
        book.setPrice(request.getPrice());
        book.setCategory(request.getCategory());

        List<BookTranslation> newTranslations = request.getTranslations().stream()
            .map(t -> {
                BookTranslation translation = new BookTranslation();
                translation.setBook(book);
                translation.setLanguageCode(t.getLanguageCode());
                translation.setTitle(t.getTitle());
                translation.setDescription(t.getDescription());
                translation.setCefrLevel(t.getCefrLevel());
                return translation;
            })
            .collect(Collectors.toList());

        if (book.getTranslations() != null) {
            book.getTranslations().clear();
        }
        book.getTranslations().addAll(newTranslations);
    }

    private BookResponse toBookResponse(Book book) {
        if (book.getTranslations() == null | book.getTranslations().isEmpty())
            return null;

        List<TranslationResponse> translationDTOs = book.getTranslations().stream()
            .map(t -> new TranslationResponse(
                t.getLanguageCode(),
                t.getTitle(),
                t.getDescription(),
                t.getCefrLevel()
            ))
            .collect(Collectors.toList());

        return new BookResponse(
            book.getId(),
            book.getIsbn(),
            book.getAuthor(),
            book.getCategory(),
            book.getPrice(),
            book.getPublishedDate(),
            translationDTOs
        );
    }
}

