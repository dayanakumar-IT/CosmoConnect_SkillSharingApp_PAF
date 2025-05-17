package com.example.cosmoconnect.Service;

import com.example.cosmoconnect.Entity.LearningPlan;
import com.example.cosmoconnect.Repo.LearningPlanRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LearningPlanService {
@Autowired
private LearningPlanRepo repo;

    public LearningPlan saveorUpdate(LearningPlan learningPlan) {
        return repo.save(learningPlan);
    }

    public Iterable<LearningPlan> listAll() {
        return this.repo.findAll();
    }

    public void deleteLearningPlan(String id) {
        repo.deleteById(id);
    }

    public LearningPlan getLearningPlanById(String learningPlanid) {
        return repo.findById(learningPlanid).get();
    }
}
