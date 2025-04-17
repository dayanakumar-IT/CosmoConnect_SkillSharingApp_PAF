package com.example.cosmoconnect.Services;

import com.example.cosmoconnect.Entity.Learning;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LearningService {
    @Autowired
    private LearningRepo repo;

    public void saveorUpdate(Learning learnings) {
        repo.save(learnings);
    }

    public Iterable<Learning> listAll() {
        return this.repo.findAll();
    }

    public void deleteLearning(String id) {
        repo.deleteById(id);
    }

    public Learning getLearningById(String learningid) {
        return repo.findById(learningid).get();
    }
}

