package com.example.cosmoconnect.repository;

import com.example.cosmoconnect.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    List<Post> findByAuthorIdInOrderByCreatedAtDesc(List<String> authorIds);
    List<Post> findByCelestialObjectContainingIgnoreCase(String celestialObject);
    List<Post> findByIsPublicTrueOrderByCreatedAtDesc();
} 