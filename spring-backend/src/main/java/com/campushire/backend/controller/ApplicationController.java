package com.campushire.backend.controller;

import com.campushire.backend.model.ApplicationEntity;
import com.campushire.backend.repository.ApplicationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    public ApplicationController(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/applications")
    public List<ApplicationEntity> getAllApplications() {
        return applicationRepository.findAll();
    }

    @PostMapping("/applications")
    public ResponseEntity<ApplicationEntity> createApplication(@RequestBody ApplicationEntity application) {
        if (application.getDate() == null) {
            application.setDate(LocalDate.now());
        }
        if (application.getStatus() == null) {
            application.setStatus("applied");
        }
        ApplicationEntity saved = applicationRepository.save(application);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
