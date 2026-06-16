package com.lingoshelf.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lingoshelf.proyecto.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

}
