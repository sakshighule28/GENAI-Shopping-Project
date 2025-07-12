package com.clothingstore.controller;

import com.clothingstore.entity.State;
import com.clothingstore.entity.City;
import com.clothingstore.repository.StateRepository;
import com.clothingstore.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {
    
    @Autowired
    private StateRepository stateRepository;
    
    @Autowired
    private CityRepository cityRepository;
    
    @GetMapping("/states")
    public List<State> searchStates(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return stateRepository.findByNameContainingIgnoreCase(search);
        }
        return stateRepository.findAll();
    }
    
    @GetMapping("/cities/{stateId}")
    public List<City> getCitiesByState(@PathVariable Long stateId, @RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return cityRepository.findByStateIdAndNameContainingIgnoreCase(stateId, search);
        }
        return cityRepository.findByStateId(stateId);
    }
}