package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import java.util.List;

public interface PostServiceContract {
    List<PostDto> getAllPosts();
    PostDto getPost(long id);
    PostDto createPost(PostDto postDto, long authorId, long categoryId);
    PostDto updatePost(PostDto postDto,long id);
    PostDto deletePostById(long id);
    List<PostDto> getAllPostsByUser(long id);
    List<PostDto> getAllPostsByCategory(long id);
    List<PostDto> searchPosts(String keyword);



}
