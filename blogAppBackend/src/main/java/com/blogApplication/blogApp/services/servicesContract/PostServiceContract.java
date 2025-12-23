package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.entities.Post;

import java.util.List;

public interface PostServiceContract {
    List<PostDto> getAllPosts();
    PostDto getPostById(long postId);
    PostDto createPost(PostDto postDto, long authorId, long categoryId);
    PostDto updatePost(PostDto postDto,long id);
    PostDto deletePost(long id);
     List<PostDto> getAllPostsByCategory(long categoryId);
     List<PostDto> getAllPostsByUser(long userId);


        List<PostDto> searchPosts(String keyword);



    }
