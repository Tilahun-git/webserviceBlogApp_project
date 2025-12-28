package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PostServiceContract {
    Page<PostDto> getAllPosts(int pageNumber, int pageSize, Sort sort, String search);
    PostDto getPostById(long id);
    PostDto createPost(PostDto postDto, MultipartFile mediaFile, long authorId, long categoryId) throws IOException;
    PostDto updatePost(PostDto postDto, MultipartFile mediaFile, long id) throws IOException;
    PostDto deletePostById(long id) throws IOException;

    boolean toggleLike(long postId, long userId);

    Page<PostDto> getPostsByUser(long userId, int pageNumber, int pageSize, Sort sort);
    Page<PostDto> getPostsByCategory(long categoryId, int pageNumber, int pageSize, Sort sort);
    Page<PostDto> searchPosts(String keyword, int pageNumber, int pageSize, Sort sort);
}

