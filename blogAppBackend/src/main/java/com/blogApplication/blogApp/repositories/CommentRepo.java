package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository<Comment, Long> {
}
