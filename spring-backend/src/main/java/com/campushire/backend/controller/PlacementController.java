package com.campushire.backend.controller;

import com.campushire.backend.model.Placement;
import com.campushire.backend.repository.PlacementRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlacementController {

    private final PlacementRepository placementRepository;

    public PlacementController(PlacementRepository placementRepository) {
        this.placementRepository = placementRepository;
    }

    @GetMapping("/placements")
    public List<Placement> getAllPlacements() {
        return placementRepository.findAll();
    }
}
