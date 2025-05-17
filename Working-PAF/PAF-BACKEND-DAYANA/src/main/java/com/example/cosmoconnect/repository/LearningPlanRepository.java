package com.example.cosmoconnect.repository;

import com.example.cosmoconnect.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByIsPublic(boolean isPublic);
} 