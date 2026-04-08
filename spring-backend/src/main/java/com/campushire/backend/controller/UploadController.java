package com.campushire.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UploadController {

    private static final Path UPLOAD_DIR = Paths.get("uploads");

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestPart("avatar") MultipartFile avatar,
            @RequestPart(value = "userId", required = false) String userId
    ) throws IOException {
        if (avatar.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
        }

        Files.createDirectories(UPLOAD_DIR);
        String originalFilename = StringUtils.cleanPath(avatar.getOriginalFilename());
        String extension = "";
        if (originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }

        String fileName = String.format("avatar-%s%s", Instant.now().toEpochMilli(), extension);
        Path destination = UPLOAD_DIR.resolve(fileName);
        avatar.transferTo(destination);

        String avatarUrl = "/uploads/" + fileName;
        Map<String, String> response = new HashMap<>();
        response.put("avatarUrl", avatarUrl);
        response.put("userId", userId == null ? "unknown" : userId);

        return ResponseEntity.ok(response);
    }
}
