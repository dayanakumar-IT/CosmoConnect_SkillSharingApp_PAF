package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.model.LearningPlan;
import com.example.cosmoconnect.service.LearningPlanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/learningplan")
@CrossOrigin(origins = "*")
public class LearningPlanController {

    @Autowired
    private LearningPlanService service;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ Save with multipart handling
    @PostMapping(value = "/save", consumes = { "multipart/form-data" })
    public ResponseEntity<LearningPlan> save(
            @RequestPart("plan") LearningPlan plan,
            @RequestPart(value = "learningmaterial", required = false) MultipartFile learningMaterial
    ) throws IOException {
        return ResponseEntity.ok(service.save(plan, learningMaterial));
    }

    // ✅ Update with multipart handling
    @PutMapping(value = "/edit/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<LearningPlan> update(
            @PathVariable String id,
            @RequestPart("plan") LearningPlan plan,
            @RequestPart(value = "learningmaterial", required = false) MultipartFile learningMaterial
    ) throws IOException {
        LearningPlan updated = service.update(id, plan, learningMaterial);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<LearningPlan>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/getPublic")
    public ResponseEntity<List<LearningPlan>> getPublic() {
        return ResponseEntity.ok(service.getPublic());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getById(@PathVariable String id) {
        return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
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

    // ✅ Display image via browser
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<?> serveFile(@PathVariable String filename) {
        return service.loadFile(filename); // should return a ResponseEntity<Resource>
    }

    // Create learning plan (JSON only)
    @PostMapping(value = "/save", consumes = "application/json")
    public ResponseEntity<LearningPlan> save(@RequestBody LearningPlan plan) throws IOException {
        return ResponseEntity.ok(service.save(plan, null));
    }

    // Update learning plan (JSON only)
    @PutMapping(value = "/edit/{id}", consumes = "application/json")
    public ResponseEntity<LearningPlan> update(
            @PathVariable String id,
            @RequestBody LearningPlan plan
    ) throws IOException {
        LearningPlan updated = service.update(id, plan, null);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Upload PDF for a learning plan
    @PostMapping(value = "/{id}/upload-material", consumes = "multipart/form-data")
    public ResponseEntity<LearningPlan> uploadMaterial(
            @PathVariable String id,
            @RequestPart("learningmaterial") MultipartFile learningMaterial
    ) throws IOException {
        LearningPlan updated = service.update(id, null, learningMaterial);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
}
