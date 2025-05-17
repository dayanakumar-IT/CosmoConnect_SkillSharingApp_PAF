package com.example.cosmoconnect.Repo;

import com.example.cosmoconnect.Entity.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepo extends MongoRepository<LearningPlan, String> {
}
