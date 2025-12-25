package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.dto.postDto.PostResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface PostServiceContract {
//    List<PostResponseDto> getAllPosts();

     Page<PostResponseDto> getAllPosts(int pageNumber, int pageSize, Sort sort, String search);


        PostResponseDto getPost(long id);

    PostResponseDto createPost(PostDto postDto, long authorId, long categoryId);

    PostResponseDto updatePost(PostDto postDto, long id);

    PostResponseDto deletePostById(long id);

    Page<PostResponseDto> getPostsByUser(long userId, int pageNumber, int pageSize, Sort sort);

    Page<PostResponseDto> getPostsByCategory(long categoryId, int pageNumber, int pageSize, Sort sort);

    Page<PostResponseDto> searchPosts(
            String keyword,
            int pageNumber,
            int pageSize,
            Sort sort
    );


}
