package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.entities.Like;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.repositories.LikeRepo;
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
    private final LikeRepo likeRepo;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;
    private final CloudinaryMediaServiceImpl cloudinaryMediaService; // Changed to Media service




    @Override
    public Page<PostDto> getAllPosts(int pageNumber, int pageSize, Sort sort, String search) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> posts = postRepo.findAll(pageable);


        if (posts.isEmpty()) {
            throw new ResourceNotFoundException("Post", "There is no post found", null);
        }
        return posts.map(this::mapToPostDto);
    }

    @Override
    public PostDto getPostById(long id) {
        Post foundPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToPostDto(foundPost);
    }

    @Override
    public PostDto createPost(PostDto postDto, MultipartFile mediaFile, long authorId, long categoryId)
            throws IOException {

        User user = userRepo.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        Post post = modelMapper.map(postDto, Post.class);
        post.setAuthor(user);
        post.setCategory(category);
        String mediaUrl = cloudinaryMediaService.uploadMedia(mediaFile);
        post.setMediaUrl(mediaUrl); // Store Cloudinary URL
        post.setMediaType(mediaFile.getContentType());


        Post savedPost = postRepo.save(post);
        return mapToPostDto(savedPost);
    }

    @Override
    public PostDto updatePost(PostDto postDto, MultipartFile mediaFile, long id) throws IOException {
        Post existingPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        // Update basic fields from DTO
        if (postDto.getTitle() != null) {
            existingPost.setTitle(postDto.getTitle());
        }
        if (postDto.getContent() != null) {
            existingPost.setContent(postDto.getContent());
        }

        // Handle media update
        if (mediaFile != null && !mediaFile.isEmpty()) {
            String newMediaUrl = cloudinaryMediaService.updateMedia(
                    existingPost.getMediaUrl(),
                    mediaFile
            );
            existingPost.setMediaUrl(newMediaUrl);
        }

        Post updatedPost = postRepo.save(existingPost);
        return mapToPostDto(updatedPost);

    }

    @Override
    public PostDto deletePostById(long id) throws IOException{
        Post deletedPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        // Delete media from Cloudinary
        if (deletedPost.getMediaUrl() != null) {
            cloudinaryMediaService.deleteMedia(deletedPost.getMediaUrl());
        }

        postRepo.delete(deletedPost);
        return mapToPostDto(deletedPost);
    }






    //toggle like of specific post
    public boolean toggleLike(long postId, long userId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post","postId",postId));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        var existingLike = likeRepo.findByPostAndUser(post, user);

        if (existingLike.isPresent()) {
            likeRepo.delete(existingLike.get());
            post.setLikeCount(post.getLikeCount() - 1);
            postRepo.save(post);
            return false; // now unliked
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepo.save(like);

            post.setLikeCount(post.getLikeCount() + 1);
            postRepo.save(post);
            return true; // now liked
        }
    }


    // method to get all posts in authored by a certain user

    @Override
    public Page<PostDto> getPostsByUser(long userId, int pageNumber, int pageSize, Sort sort) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> postsByUser = postRepo.findAllByAuthor(user, pageable);

        return postsByUser.map(this::mapToPostDto);
    }

    @Override
    public Page<PostDto> getPostsByCategory(long categoryId, int pageNumber, int pageSize, Sort sort) {

        modelMapper.typeMap(Post.class, PostDto.class).addMappings(mapper -> {
            mapper.map(src -> src.getAuthor().getUsername(), PostDto::setAuthor);
            mapper.map(src -> src.getCategory().getTitle(), PostDto::setCategoryTitle);
        });
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> postsByCat = postRepo.findAllByCategory(category, pageable);

        return postsByCat.map(this::mapToPostDto);
    }

    // method to search posts using keyword

    @Override
    public Page<PostDto> searchPosts(String keyword, int pageNumber, int pageSize, Sort sort) {


        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> searchedPosts = postRepo
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                        keyword, keyword, pageable);

        if (searchedPosts.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Post",
                    "There is no post found",
                    null
            );
        }
        return searchedPosts.map(this::mapToPostDto);


    }


    // Helper method to map Post to PostDto with custom logic
    private PostDto mapToPostDto(Post post) {
        PostDto dto = modelMapper.map(post, PostDto.class);

        // Custom assignments
        dto.setAuthor(post.getAuthor().getUsername());
        dto.setCategoryTitle(post.getCategory().getTitle());

        return dto;
    }

}

