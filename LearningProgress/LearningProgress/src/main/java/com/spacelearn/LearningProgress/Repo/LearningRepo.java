package com.spacelearn.LearningProgress.Repo;

import com.spacelearn.LearningProgress.Entity.Learning;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningRepo extends MongoRepository<Learning,String> {
}
