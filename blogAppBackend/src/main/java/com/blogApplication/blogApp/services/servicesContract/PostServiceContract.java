package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.postDto.PostResponseDto;
import java.util.List;

public interface PostServiceContract {
    List<PostResponseDto> getAllPosts();
    PostResponseDto getPost(long id);
    PostResponseDto createPost(PostResponseDto postDto, long authorId, long categoryId);
    PostResponseDto updatePost(PostResponseDto postDto, long id);
    PostResponseDto deletePostById(long id);
    List<PostResponseDto> getAllPostsByUser(long id);
    List<PostResponseDto> getAllPostsByCategory(long id);
    List<PostResponseDto> searchPosts(String keyword);



}
