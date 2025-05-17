package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file, "uploads");
            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    @PostMapping("/upload/multiple")
    public ResponseEntity<List<String>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        if (files.length == 0 || files.length > 3) {
            throw new RuntimeException("You must upload between 1 and 3 files.");
        }
        List<String> fileNames = new ArrayList<>();
        try {
            for (MultipartFile file : files) {
                String fileName = fileStorageService.storeFile(file, "uploads");
                fileNames.add(fileName);
            }
            return ResponseEntity.ok(fileNames);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
} 