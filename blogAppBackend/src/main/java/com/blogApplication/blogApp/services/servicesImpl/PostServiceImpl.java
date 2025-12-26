package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.PostServiceContract;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostServiceContract {
    private  final PostRepo postRepo;
    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;
    private final CloudinaryImageServiceImpl cloudinaryImageServiceImpl;


    @Override
    public Page<PostDto> getAllPosts(int pageNumber, int pageSize, Sort sort, String search) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> posts = postRepo.findAll(pageable);

        return posts.map(post -> {
            PostDto post1 = modelMapper.map(post, PostDto.class);
            post1.setAuthor(post.getAuthor().getUsername());
            post1.setCategoryTitle(post.getCategory().getTitle());
            return post1;
        });
    }
    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepo.findAll();

        if (posts.isEmpty()) {
            throw new ResourceNotFoundException("Post","There is no post found",null);
        }
        return posts.stream().map(post -> {
                    PostDto dto = modelMapper.map(post, PostDto.class);
                    dto.setAuthor(post.getAuthor().getUsername());
                    dto.setCategoryTitle(post.getCategory().getTitle());
                    return dto;
                }).toList();
    }

    @Override
    public PostDto getPostById(long id) {
        Post foundPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        return modelMapper.map(foundPost, PostDto.class);
    }

    @Override
    public PostDto createPost(PostDto postDto, MultipartFile imageFile , long authorId, long categoryId) throws IOException {


        User user = userRepo.findById(authorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User","id",authorId));

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category","id",categoryId));
        Post postCreated = modelMapper.map(postDto, Post.class);
        postCreated.setAuthor(user);
        postCreated.setCategory(category);

        // Use Cloudinary instead of storing in database
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryImageServiceImpl.uploadImage(imageFile);
            postCreated.setImageUrl(imageUrl);
            // Remove these database storage lines
             postCreated.setImageName(imageFile.getOriginalFilename());
             postCreated.setImageType(imageFile.getContentType());
            // postCreated.setImageData(imageFile.getBytes());
        }

        Post savedPost = postRepo.save(postCreated);
        PostDto responseDto = modelMapper.map(savedPost, PostDto.class);

        responseDto.setAuthor(savedPost.getAuthor().getUsername());
        responseDto.setCategoryTitle(savedPost.getCategory().getTitle());
        return responseDto;

    }

    @Override
    public PostDto updatePost(PostDto postDto, MultipartFile imageFile, long id) throws IOException {
        Post existingPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        modelMapper.map(postDto, existingPost);

        if (imageFile != null && !imageFile.isEmpty()) {
            // Update image in Cloudinary
            String newImageUrl = cloudinaryImageServiceImpl.updateImage(
                    existingPost.getImageUrl(),
                    imageFile
            );
            existingPost.setImageUrl(newImageUrl);
            // Remove database image storage
             existingPost.setImageName(imageFile.getOriginalFilename());
             existingPost.setImageType(imageFile.getContentType());
            // existingPost.setImageData(imageFile.getBytes());
        }

        Post updatedPost = postRepo.save(existingPost);
        PostDto updatedPostDto = modelMapper.map(updatedPost, PostDto.class);

        // Assign custom information
        updatedPostDto.setAuthor(updatedPost.getAuthor().getUsername());
        updatedPostDto.setCategoryTitle(updatedPost.getCategory().getTitle());
        return updatedPostDto;
    }

    @Override
    public PostDto deletePostById(long id) {
        Post deletedPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        // Delete image from Cloudinary
        if (deletedPost.getImageUrl() != null) {
            cloudinaryImageServiceImpl.deleteImage(deletedPost.getImageUrl());
        }

        postRepo.delete(deletedPost);
        PostDto deletedPostDto = modelMapper.map(deletedPost, PostDto.class);

        // Assign custom information
        deletedPostDto.setAuthor(deletedPost.getAuthor().getUsername());
        deletedPostDto.setCategoryTitle(deletedPost.getCategory().getTitle());
        return deletedPostDto;
    }


    // method to get all posts in authored by a certain user
    @Override
    public Page<PostDto> getPostsByUser(long userId, int pageNumber, int pageSize, Sort sort) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Post> PostsByUser = postRepo.findAllByAuthor(user,pageable);

        return PostsByUser.map(post -> modelMapper.map(post, PostDto.class));
    }

    // method to get all posts in a certain category

    public Page<PostDto> getPostsByCategory(long categoryId, int pageNumber, int pageSize, Sort sort) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> PostsByCat = postRepo.findAllByCategory(category, pageable);
        return PostsByCat.map(post -> modelMapper.map(post,PostDto.class));
    }
    // method to search posts using keyword
    @Override
    public Page<PostDto> searchPosts(
            String keyword,
            int pageNumber,
            int pageSize,
            Sort sort
    ) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> searchedPosts = postRepo
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                        keyword,
                        keyword,
                        pageable
                );
        if (searchedPosts.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Post",
                    "There is no post found",
                    null
            );
        }
        return searchedPosts.map(post -> {
            PostDto dto = modelMapper.map(post, PostDto.class);
            dto.setAuthor(post.getAuthor().getUsername());
            dto.setCategoryTitle(post.getCategory().getTitle());
            return dto;
        });
    }



}

