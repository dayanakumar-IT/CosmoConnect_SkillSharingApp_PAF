package com.example.cosmoconnect.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class PostFileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private String getPostUploadDir() {
        return Paths.get(uploadDir, "posts").toString();
    }

    public String storeFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(getPostUploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID() + fileExtension;

        Path targetLocation = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return "posts/" + newFilename;
    }

    public Path getFilePath(String filename) {
        return Paths.get(uploadDir).resolve(filename).normalize();
    }

    public ResponseEntity<Resource> loadFile(String filename) {
        try {
            Path file = getFilePath(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists()) {
                String contentType = "application/octet-stream";
                if (resource.getFilename() != null && resource.getFilename().toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                }
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = getFilePath(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName, ex);
        }
    }
} 