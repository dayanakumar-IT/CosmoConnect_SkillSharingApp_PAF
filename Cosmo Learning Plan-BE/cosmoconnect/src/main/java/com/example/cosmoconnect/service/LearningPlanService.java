package com.example.cosmoconnect.service;

import com.example.cosmoconnect.model.LearningPlan;
import com.example.cosmoconnect.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository repo;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private NotificationService notificationService;

    public LearningPlan save(LearningPlan plan, MultipartFile learningMaterial) throws IOException {
        if (learningMaterial != null && !learningMaterial.isEmpty()) {
            String fileUrl = fileStorageService.storeFile(learningMaterial);
            plan.setLearningMaterials(List.of("/api/v1/learningplan/uploads/" + fileUrl));
        }
        return repo.save(plan);
    }

    public LearningPlan update(String id, LearningPlan plan, MultipartFile learningMaterial) throws IOException {
        Optional<LearningPlan> opt = repo.findById(id);
        if (opt.isPresent()) {
            LearningPlan existing = opt.get();
            if (plan != null) {
                if (plan.getPlanTitle() != null) existing.setPlanTitle(plan.getPlanTitle());
                if (plan.getDescription() != null) existing.setDescription(plan.getDescription());
                if (plan.getDifficultyLevel() != null) existing.setDifficultyLevel(plan.getDifficultyLevel());
                if (plan.getDuration() != null) existing.setDuration(plan.getDuration());
                if (plan.getCertificate() != null) existing.setCertificate(plan.getCertificate());
                if (plan.getPrice() != null) existing.setPrice(plan.getPrice());
                existing.setPublic(plan.isPublic());
            }
            if (learningMaterial != null && !learningMaterial.isEmpty()) {
                String fileUrl = fileStorageService.storeFile(learningMaterial);
                existing.setLearningMaterials(List.of("/api/v1/learningplan/uploads/" + fileUrl));
            }
            return repo.save(existing);
        }
        return null;
    }

    public void share(String id, String recipient, String method) {
        Optional<LearningPlan> opt = repo.findById(id);
        if (opt.isPresent()) {
            LearningPlan plan = opt.get();
            String url = "http://localhost:8080/api/v1/learningplan/" + id;
            notificationService.shareCourse(recipient, plan.getPlanTitle(), url, method);
        }
    }

    public List<LearningPlan> getAll() {
        return repo.findAll();
    }

    public List<LearningPlan> getPublic() {
        return repo.findByIsPublic(true);
    }

    public Optional<LearningPlan> getById(String id) {
        return repo.findById(id);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public ResponseEntity<Resource> loadFile(String filename) {
        return fileStorageService.loadFile(filename);
    }
}
