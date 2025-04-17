package com.spacelearn.LearningProgress.Service;


import com.spacelearn.LearningProgress.Entity.Learning;
import com.spacelearn.LearningProgress.Repo.LearningRepo;
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
