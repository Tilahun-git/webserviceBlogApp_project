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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final CloudinaryMediaServiceImpl cloudinaryMediaService;


    @Override

    public List<PostDto> getAllPosts(Pageable pageable, String search) {

        if (search != null && !search.isBlank()) {
            return postRepo
                    .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                            search, search, pageable
                    )
                    .stream()
                    .map(this::mapToPostDto)
                    .toList();
        }
        return postRepo.findAll(pageable)
                .stream()
                .map(this::mapToPostDto)
                .toList();
    }

    @Override
    public PostDto getPostById(long id) {
        Post foundPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToPostDto(foundPost);
    }

    @Override
    @PreAuthorize("hasAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_CREATE_POST)")
    public PostDto createPost(PostDto postDto, MultipartFile mediaFile, long categoryId)
            throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();



        User currentUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        Post post = modelMapper.map(postDto, Post.class);
        post.setAuthor(currentUser); // Set logged-in user as author
        post.setCategory(category);
if(!mediaFile.isEmpty()) {
    String mediaUrl = cloudinaryMediaService.uploadMedia(mediaFile);
    post.setMediaUrl(mediaUrl);
    post.setMediaType(mediaFile.getContentType());
}else {
    post.setMediaUrl(null);
    post.setMediaType(null);
}
        Post savedPost = postRepo.save(post);
        return mapToPostDto(savedPost);
    }



    @Override
//    @PreAuthorize("@postSecurity.canUpdatePost(#id, authentication)")
    public PostDto updatePost(PostDto postDto, MultipartFile mediaFile, Long id) throws IOException {
        Post existingPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        if (postDto.getTitle() != null) {
            existingPost.setTitle(postDto.getTitle());
        }
        if (postDto.getContent() != null) {
            existingPost.setContent(postDto.getContent());
        }
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

//@PreAuthorize("@postSecurity.canDeletePost(#id, authentication)")
@Transactional
public PostDto deletePostById(long id) throws IOException {
    Post post = postRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

    if (post.getMediaUrl() != null) {
        cloudinaryMediaService.deleteMedia(post.getMediaUrl());
    }

    postRepo.delete(post);
    return mapToPostDto(post);
}


    @Override
    @PreAuthorize("hasAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_LIKE_POST)")
    public boolean toggleLike(long postId, long userId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post","postId",postId));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        var existingLike = likeRepo.findByPostIdAndUserId(postId,userId);
        if (existingLike.isPresent()) {
            likeRepo.delete(existingLike.get());
            post.setLikeCount(post.getLikeCount() - 1);
            postRepo.save(post);
            return false;
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepo.save(like);

            post.setLikeCount(post.getLikeCount() + 1);
            postRepo.save(post);
            return true;
        }
    }

    // method to get all posts in authored by a certain user

    @Override
    @PreAuthorize("hasAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_VIEW_OWN_POSTS)")
    public List<PostDto> getPostsByUser(Pageable pageable) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User loggedInUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Page<Post> posts = postRepo.findAllByAuthor(loggedInUser, pageable);
        return posts.stream()
                .map(this::mapToPostDto)
                .toList();
    }
    @Override
//    @PreAuthorize("hasAnyAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_VIEW_ALL_POSTS)")
    public List<PostDto> getPostsByCategory(long categoryId, Pageable pageable) {

        modelMapper.typeMap(Post.class, PostDto.class).addMappings(mapper -> {
            mapper.map(src -> src.getAuthor().getUsername(), PostDto::setAuthor);
            mapper.map(src -> src.getCategory().getTitle(), PostDto::setCategoryTitle);
        });
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        Page<Post> postsByCat = postRepo.findAllByCategory(category, pageable);

        return postsByCat.stream().map(this::mapToPostDto).toList();
    }
    // method to search posts using keyword

    @Override
    public List<PostDto> searchPosts(String keyword, Pageable pageable) {
        Page<Post> searchedPosts = postRepo
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                        keyword, keyword, pageable);
        if (searchedPosts.isEmpty()) {
            throw new ResourceNotFoundException("Post", "There is no post found",null);
        }
        return searchedPosts.stream().map(this::mapToPostDto).toList();
    }



    //-------------------ENTITY -> DTO------------------

    private PostDto mapToPostDto(Post post) {
        PostDto dto = modelMapper.map(post, PostDto.class);

        dto.setAuthor(post.getAuthor().getUsername());
        dto.setCategoryTitle(post.getCategory().getTitle());

        return dto;
    }

}

