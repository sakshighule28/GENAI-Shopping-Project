package com.clothingstore.repository;

import com.clothingstore.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByStateIdAndNameContainingIgnoreCase(Long stateId, String name);
    List<City> findByStateId(Long stateId);
}