package com.lingoshelf.proyecto.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.lingoshelf.proyecto.dto.BookRequest;
import com.lingoshelf.proyecto.dto.BookResponse;
import com.lingoshelf.proyecto.entity.Book;
import com.lingoshelf.proyecto.entity.BookTranslation;
import com.lingoshelf.proyecto.repository.BookRepository;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BookResponse> searchBooks(String title, String lang) {
        List<Book> books = bookRepository.findByTitleInAnyLanguage(title);

        return books.stream().map(b -> {
            List<BookTranslation> translations = b.getTranslations();
            if (translations == null || translations.isEmpty()) {
                return new BookResponse(b.getId(), b.getTitle(), b.getPrice());
            }

            BookTranslation trans = translations.stream()
                    .filter(t -> lang != null && lang.equals(t.getLanguageCode()))
                    .findFirst()
                    .orElse(translations.get(0));

            return new BookResponse(b.getId(), trans.getTitle(), b.getPrice());
        }).collect(Collectors.toList());
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
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
        book.setPrice(request.getPrice());
        book.setMcer(request.getMcer());
        book.setCategory(request.getCategory());
        book.setTitle(request.getTitle());

        List<BookTranslation> newTranslations = request.getTranslations() == null
                ? List.of()
                : request.getTranslations().stream()
                        .map(t -> {
                            BookTranslation translation = new BookTranslation();
                            translation.setBook(book);
                            translation.setLanguageCode(t.getLanguageCode());
                            translation.setTitle(t.getTitle());
                            translation.setDescription(t.getDescription());
                            return translation;
                        })
                        .collect(Collectors.toList());

        if (book.getTranslations() == null) {
            book.setTranslations(new ArrayList<>());
        } else {
            book.getTranslations().clear();
        }
        book.getTranslations().addAll(newTranslations);
    }

    private BookResponse toBookResponse(Book book) {
        String responseTitle = book.getTitle();
        if (book.getTranslations() != null && !book.getTranslations().isEmpty()) {
            responseTitle = book.getTranslations().get(0).getTitle();
        }
        return new BookResponse(book.getId(), responseTitle, book.getPrice());
    }
}

