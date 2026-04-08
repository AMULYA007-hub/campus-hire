package com.campushire.backend.controller;

import com.campushire.backend.model.User;
import com.campushire.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/students")
    public List<User> getStudents() {
        return userRepository.findByRole("student");
    }

    @PostMapping("/students")
    public ResponseEntity<User> createStudent(@RequestBody User user) {
        user.setRole("student");
        user.setCreatedAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
