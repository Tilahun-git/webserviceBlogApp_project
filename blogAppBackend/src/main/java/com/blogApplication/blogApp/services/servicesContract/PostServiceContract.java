package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PostServiceContract {

    List<PostDto> getAllPosts(Pageable sort, String search);

    PostDto getPostById(long id);

     PostDto createPost(PostDto postDto, MultipartFile mediaFile, long categoryId) throws IOException;

    PostDto updatePost(PostDto postDto, MultipartFile mediaFile, Long id) throws IOException;

    PostDto deletePostById(long id)throws IOException;

    boolean toggleLike(long postId, long userId);

    List<PostDto> getPostsByUser(Pageable pageable);

    List<PostDto> getPostsByCategory(long categoryId, Pageable pageable);

    List<PostDto> searchPosts(String keyword, Pageable pageable);



}
