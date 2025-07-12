package com.clothingstore.config;

import com.clothingstore.entity.State;
import com.clothingstore.entity.City;
import com.clothingstore.repository.StateRepository;
import com.clothingstore.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private StateRepository stateRepository;
    
    @Autowired
    private CityRepository cityRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (stateRepository.count() == 0) {
            initializeData();
        }
    }
    
    private void initializeData() {
        // Maharashtra
        State maharashtra = stateRepository.save(new State("Maharashtra"));
        cityRepository.save(new City("Mumbai", maharashtra));
        cityRepository.save(new City("Navi Mumbai", maharashtra));
        cityRepository.save(new City("Pune", maharashtra));
        cityRepository.save(new City("Nagpur", maharashtra));
        cityRepository.save(new City("Nashik", maharashtra));
        cityRepository.save(new City("Aurangabad", maharashtra));
        
        // Karnataka
        State karnataka = stateRepository.save(new State("Karnataka"));
        cityRepository.save(new City("Bangalore", karnataka));
        cityRepository.save(new City("Mysore", karnataka));
        cityRepository.save(new City("Hubli", karnataka));
        cityRepository.save(new City("Mangalore", karnataka));
        
        // Tamil Nadu
        State tamilNadu = stateRepository.save(new State("Tamil Nadu"));
        cityRepository.save(new City("Chennai", tamilNadu));
        cityRepository.save(new City("Coimbatore", tamilNadu));
        cityRepository.save(new City("Madurai", tamilNadu));
        cityRepository.save(new City("Salem", tamilNadu));
        
        // Gujarat
        State gujarat = stateRepository.save(new State("Gujarat"));
        cityRepository.save(new City("Ahmedabad", gujarat));
        cityRepository.save(new City("Surat", gujarat));
        cityRepository.save(new City("Vadodara", gujarat));
        cityRepository.save(new City("Rajkot", gujarat));
        
        // Rajasthan
        State rajasthan = stateRepository.save(new State("Rajasthan"));
        cityRepository.save(new City("Jaipur", rajasthan));
        cityRepository.save(new City("Jodhpur", rajasthan));
        cityRepository.save(new City("Udaipur", rajasthan));
        cityRepository.save(new City("Kota", rajasthan));
        
        // Uttar Pradesh
        State up = stateRepository.save(new State("Uttar Pradesh"));
        cityRepository.save(new City("Lucknow", up));
        cityRepository.save(new City("Kanpur", up));
        cityRepository.save(new City("Agra", up));
        cityRepository.save(new City("Varanasi", up));
        cityRepository.save(new City("Noida", up));
        
        // West Bengal
        State wb = stateRepository.save(new State("West Bengal"));
        cityRepository.save(new City("Kolkata", wb));
        cityRepository.save(new City("Howrah", wb));
        cityRepository.save(new City("Durgapur", wb));
        cityRepository.save(new City("Siliguri", wb));
        
        // Delhi
        State delhi = stateRepository.save(new State("Delhi"));
        cityRepository.save(new City("New Delhi", delhi));
        cityRepository.save(new City("South Delhi", delhi));
        cityRepository.save(new City("North Delhi", delhi));
        cityRepository.save(new City("East Delhi", delhi));
        
        // Punjab
        State punjab = stateRepository.save(new State("Punjab"));
        cityRepository.save(new City("Ludhiana", punjab));
        cityRepository.save(new City("Amritsar", punjab));
        cityRepository.save(new City("Jalandhar", punjab));
        cityRepository.save(new City("Patiala", punjab));
        
        // Haryana
        State haryana = stateRepository.save(new State("Haryana"));
        cityRepository.save(new City("Gurgaon", haryana));
        cityRepository.save(new City("Faridabad", haryana));
        cityRepository.save(new City("Panipat", haryana));
        cityRepository.save(new City("Ambala", haryana));
        
        // Kerala
        State kerala = stateRepository.save(new State("Kerala"));
        cityRepository.save(new City("Thiruvananthapuram", kerala));
        cityRepository.save(new City("Kochi", kerala));
        cityRepository.save(new City("Kozhikode", kerala));
        cityRepository.save(new City("Thrissur", kerala));
        
        // Andhra Pradesh
        State ap = stateRepository.save(new State("Andhra Pradesh"));
        cityRepository.save(new City("Visakhapatnam", ap));
        cityRepository.save(new City("Vijayawada", ap));
        cityRepository.save(new City("Guntur", ap));
        cityRepository.save(new City("Tirupati", ap));
        
        // Telangana
        State telangana = stateRepository.save(new State("Telangana"));
        cityRepository.save(new City("Hyderabad", telangana));
        cityRepository.save(new City("Warangal", telangana));
        cityRepository.save(new City("Nizamabad", telangana));
        cityRepository.save(new City("Khammam", telangana));
    }
}