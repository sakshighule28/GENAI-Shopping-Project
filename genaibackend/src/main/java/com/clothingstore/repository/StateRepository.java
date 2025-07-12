package com.clothingstore.repository;

import com.clothingstore.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateRepository extends JpaRepository<State, Long> {
    List<State> findByNameContainingIgnoreCase(String name);
}