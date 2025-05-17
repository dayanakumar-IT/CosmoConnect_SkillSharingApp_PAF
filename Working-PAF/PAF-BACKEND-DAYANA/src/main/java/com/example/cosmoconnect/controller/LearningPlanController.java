package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.model.LearningPlan;
import com.example.cosmoconnect.service.LearningPlanService;
import com.example.cosmoconnect.service.LearningPlanFileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/learningplan")
public class LearningPlanController {

    @Autowired
    private LearningPlanService service;

    @Autowired
    private LearningPlanFileStorageService learningPlanFileStorageService;

    @PostMapping
    public ResponseEntity<?> save(
            @RequestPart("plan") String planJson,
            @RequestPart(value = "learningMaterial", required = false) MultipartFile learningMaterial) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            LearningPlan plan = mapper.readValue(planJson, LearningPlan.class);
            System.out.println("Received plan: " + plan);
            
            // Set createdBy from authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication != null ? authentication.getName() : null;
            plan.setCreatedBy(userEmail);
            
            // Validate required fields
            if (plan.getTitle() == null || plan.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            if (plan.getDescription() == null || plan.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Description is required");
            }
            if (plan.getDifficultyLevel() == null || plan.getDifficultyLevel().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Difficulty level is required");
            }
            
            // Store file and set URL
            if (learningMaterial != null && !learningMaterial.isEmpty()) {
                String storedPath = learningPlanFileStorageService.storeFile(learningMaterial);
                plan.setLearningMaterials(java.util.List.of("/api/learningplans/files/" + storedPath.substring("learningplans/".length())));
            }
            LearningPlan savedPlan = service.save(plan, null);
            return ResponseEntity.ok(savedPlan);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid plan data format: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating learning plan: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestPart("plan") String planJson,
            @RequestPart(value = "learningMaterial", required = false) MultipartFile learningMaterial) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            LearningPlan plan = mapper.readValue(planJson, LearningPlan.class);
            
            // Store file and set URL
            if (learningMaterial != null && !learningMaterial.isEmpty()) {
                String storedPath = learningPlanFileStorageService.storeFile(learningMaterial);
                plan.setLearningMaterials(java.util.List.of("/api/learningplans/files/" + storedPath.substring("learningplans/".length())));
            }
            LearningPlan updated = service.update(id, plan, null);
            return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid plan data format: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating learning plan: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/public")
    public ResponseEntity<List<LearningPlan>> getPublic() {
        return ResponseEntity.ok(service.getPublic());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        return learningPlanFileStorageService.loadFile("learningplans/" + filename);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<Void> share(
            @PathVariable String id,
            @RequestParam String recipient,
            @RequestParam String shareMethod) {
        service.share(id, recipient, shareMethod);
        return ResponseEntity.ok().build();
    }

    // Upload PDF for a learning plan
    @PostMapping(value = "/{id}/upload-material", consumes = "multipart/form-data")
    public ResponseEntity<LearningPlan> uploadMaterial(
            @PathVariable String id,
            @RequestPart("learningmaterial") MultipartFile learningMaterial
    ) throws IOException {
        if (learningMaterial != null && !learningMaterial.isEmpty()) {
            String storedPath = learningPlanFileStorageService.storeFile(learningMaterial);
            LearningPlan plan = new LearningPlan();
            plan.setLearningMaterials(java.util.List.of("/api/learningplans/files/" + storedPath.substring("learningplans/".length())));
            LearningPlan updated = service.update(id, plan, null);
            return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
