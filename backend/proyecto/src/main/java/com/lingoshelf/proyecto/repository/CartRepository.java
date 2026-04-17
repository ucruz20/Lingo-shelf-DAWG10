package com.lingoshelf.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lingoshelf.proyecto.entity.CartItem;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {

}
