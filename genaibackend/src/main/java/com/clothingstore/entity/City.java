package com.clothingstore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cities")
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "state_id", nullable = false)
    private Long stateId;
    
    // Constructors
    public City() {}
    
    public City(String name, Long stateId) {
        this.name = name;
        this.stateId = stateId;
    }
    
    public City(String name, State state) {
        this.name = name;
        this.stateId = state.getId();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Long getStateId() { return stateId; }
    public void setStateId(Long stateId) { this.stateId = stateId; }
}