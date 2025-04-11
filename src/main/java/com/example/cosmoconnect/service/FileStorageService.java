package com.example.cosmoconnect.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {
    
    private final Path fileStorageLocation;
    
    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads")
                .toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("File storage directory created at: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create the directory where the uploaded files will be stored.", ex);
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }
    
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            log.error("Failed to store empty file");
            throw new RuntimeException("Failed to store empty file");
        }

        try {
            // Generate a unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            if (originalFilename.contains("..")) {
                log.error("Cannot store file with relative path outside current directory: {}", originalFilename);
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFilename);
            }

            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + fileExtension;
            
            log.info("Storing file: {} with new name: {}", originalFilename, fileName);
            
            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            log.info("File stored successfully at: {}", targetLocation);
            return fileName;
        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            throw new RuntimeException("Failed to store file. Please try again!", ex);
        }
    }
    
    public Path loadFile(String filename) {
        try {
            Path filePath = fileStorageLocation.resolve(filename).normalize();
            if (!filePath.startsWith(fileStorageLocation)) {
                log.error("Cannot access file outside current directory: {}", filename);
                throw new RuntimeException("Cannot access file outside current directory");
            }
            return filePath;
        } catch (Exception ex) {
            log.error("Failed to load file: {}", filename, ex);
            throw new RuntimeException("Failed to load file: " + filename, ex);
        }
    }
} 