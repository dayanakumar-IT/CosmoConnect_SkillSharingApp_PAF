package com.example.cosmoconnect.repository;

import com.example.cosmoconnect.model.Learning;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningRepo extends MongoRepository<Learning, String> {
    List<Learning> findByUserId(String userId);
}
