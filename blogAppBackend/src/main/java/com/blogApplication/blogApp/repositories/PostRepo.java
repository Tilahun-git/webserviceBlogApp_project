package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepo extends JpaRepository<Post, Long> {
}
