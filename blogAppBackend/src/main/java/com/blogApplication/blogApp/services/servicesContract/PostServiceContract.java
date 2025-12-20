package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.entities.Post;

import java.util.List;

public interface PostServiceContract {
    List<Post> getAllPosts();
    Post getPost(long id);
    Post createPost(Post post);
    Post updatePost(Post post,long id);
    void deletePost(long id);


}
