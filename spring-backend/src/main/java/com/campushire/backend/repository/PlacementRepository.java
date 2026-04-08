package com.campushire.backend.repository;

import com.campushire.backend.model.Placement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlacementRepository extends JpaRepository<Placement, Long> {
}
