package com.lingoshelf.proyecto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lingoshelf.proyecto.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT DISTINCT b FROM Book b JOIN b.translations t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Book> findByTitleInAnyLanguage(@Param("searchTerm") String searchTerm);
}
