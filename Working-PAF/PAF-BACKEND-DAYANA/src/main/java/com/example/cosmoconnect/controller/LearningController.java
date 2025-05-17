package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.model.Learning;
import com.example.cosmoconnect.service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import java.util.List;

@RestController
// @CrossOrigin(origins = "*") // Removed to use global CORS config
@RequestMapping("/api/v1/learning")
public class LearningController {
    private static final Logger logger = LoggerFactory.getLogger(LearningController.class);
    
    @Autowired
    private LearningService learningService;

    @PostMapping(value = "/save")
    public ResponseEntity<?> saveLearning(@Valid @RequestBody Learning learning) {
        try {
            logger.info("Received request to save learning entry: {}", learning);
            Learning savedLearning = learningService.saveorUpdate(learning);
            return ResponseEntity.ok(savedLearning);
        } catch (Exception e) {
            logger.error("Error saving learning entry: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Failed to save learning entry: " + e.getMessage());
        }
    }

    @GetMapping(value = "/getAll")
    public ResponseEntity<?> getLearnings() {
        try {
            logger.info("Received request to get all learning entries");
            return ResponseEntity.ok(learningService.listAll());
        } catch (Exception e) {
            logger.error("Error fetching learning entries: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch learning entries: " + e.getMessage());
        }
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<?> update(@RequestBody Learning learning, @PathVariable(name = "id") String id) {
        try {
            logger.info("Received request to update learning entry with id: {}", id);
            learning.setId(id);
            Learning updatedLearning = learningService.saveorUpdate(learning);
            return ResponseEntity.ok(updatedLearning);
        } catch (Exception e) {
            logger.error("Error updating learning entry: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update learning entry: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLearning(@PathVariable("id") String id) {
        try {
            logger.info("Received request to delete learning entry with id: {}", id);
            learningService.deleteLearning(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting learning entry: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to delete learning entry: " + e.getMessage());
        }
    }

    @GetMapping("/learning/{id}")
    public ResponseEntity<?> getLearning(@PathVariable(name = "id") String learningid) {
        try {
            logger.info("Received request to get learning entry with id: {}", learningid);
            return ResponseEntity.ok(learningService.getLearningById(learningid));
        } catch (Exception e) {
            logger.error("Error fetching learning entry: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch learning entry: " + e.getMessage());
        }
    }

    @GetMapping("/getByUserId/{userId}")
    public ResponseEntity<?> getLearningsByUser(@PathVariable String userId) {
        try {
            logger.info("Received request to get learning entries for user: {}", userId);
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("Invalid userId provided: {}", userId);
                return ResponseEntity.badRequest().body("User ID cannot be null or empty");
            }
            List<Learning> learnings = learningService.getLearningsByUserId(userId);
            logger.info("Successfully retrieved {} learning entries for user {}", learnings.size(), userId);
            return ResponseEntity.ok(learnings);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request for user {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching learning entries for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to fetch learning entries: " + e.getMessage());
        }
    }
}
