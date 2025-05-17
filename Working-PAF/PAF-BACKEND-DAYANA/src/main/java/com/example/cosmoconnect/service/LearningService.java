package com.example.cosmoconnect.service;

import com.example.cosmoconnect.model.Learning;
import com.example.cosmoconnect.repository.LearningRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;
import java.util.List;

@Service
public class LearningService {
    private static final Logger logger = LoggerFactory.getLogger(LearningService.class);
    
    @Autowired
    private LearningRepo repo;

    public Learning saveorUpdate(Learning incoming) {
        try {
            logger.info("Saving or updating learning entry: {}", incoming);
            if (incoming.getId() != null) {
                Optional<Learning> existingOpt = repo.findById(incoming.getId());
                if (existingOpt.isPresent()) {
                    Learning existing = existingOpt.get();
                    // Update all fields
                    existing.setLearningTopic(incoming.getLearningTopic());
                    existing.setLearningSubject(incoming.getLearningSubject());
                    existing.setWhatDidYouLearn(incoming.getWhatDidYouLearn());
                    existing.setStartDate(incoming.getStartDate());
                    existing.setEndDate(incoming.getEndDate());
                    existing.setCurrentProgressStage(incoming.getCurrentProgressStage());
                    existing.setTimeSpentInHours(incoming.getTimeSpentInHours());
                    existing.setPublic(incoming.isPublic());
                    existing.setSkills(incoming.getSkills());
                    existing.setNextSteps(incoming.getNextSteps());
                    return repo.save(existing);
                }
            }
            // If no ID or not found, treat as new
            return repo.save(incoming);
        } catch (Exception e) {
            logger.error("Error saving learning entry: {}", e.getMessage());
            throw new RuntimeException("Failed to save learning entry", e);
        }
    }

    public Iterable<Learning> listAll() {
        try {
            logger.info("Fetching all learning entries");
            return this.repo.findAll();
        } catch (Exception e) {
            logger.error("Error fetching learning entries: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch learning entries", e);
        }
    }

    public void deleteLearning(String id) {
        try {
            logger.info("Deleting learning entry with id: {}", id);
            if (!repo.existsById(id)) {
                throw new RuntimeException("Learning entry not found with id: " + id);
            }
            repo.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting learning entry: {}", e.getMessage());
            throw new RuntimeException("Failed to delete learning entry", e);
        }
    }

    public Learning getLearningById(String learningid) {
        try {
            logger.info("Fetching learning entry with id: {}", learningid);
            Optional<Learning> learning = repo.findById(learningid);
            if (learning.isPresent()) {
                return learning.get();
            } else {
                throw new RuntimeException("Learning entry not found with id: " + learningid);
            }
        } catch (Exception e) {
            logger.error("Error fetching learning entry: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch learning entry", e);
        }
    }

    public List<Learning> getLearningsByUserId(String userId) {
        try {
            logger.info("Fetching learning entries for user: {}", userId);
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("Invalid userId provided: {}", userId);
                throw new IllegalArgumentException("User ID cannot be null or empty");
            }
            List<Learning> learnings = repo.findByUserId(userId);
            logger.info("Found {} learning entries for user {}", learnings.size(), userId);
            return learnings;
        } catch (Exception e) {
            logger.error("Error fetching learning entries for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch learning entries for user: " + e.getMessage(), e);
        }
    }
}

