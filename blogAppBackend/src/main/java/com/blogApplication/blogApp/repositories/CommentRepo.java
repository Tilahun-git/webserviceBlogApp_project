package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Comment;
import com.blogApplication.blogApp.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Long> {

    List<Comment> findByPostId(long postId);


    Page<Comment> findByPost(Post post, Pageable pageable);

    Page<Comment> findByPostAndContentContainingIgnoreCase(
            Post post,
            String keyword,
            Pageable pageable
    );

}
