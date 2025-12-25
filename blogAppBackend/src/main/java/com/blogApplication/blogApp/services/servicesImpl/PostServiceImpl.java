//package com.blogApplication.blogApp.services.servicesImpl;
//
//import com.blogApplication.blogApp.dto.postDto.PostDto;
//import com.blogApplication.blogApp.entities.Category;
//import com.blogApplication.blogApp.entities.Post;
//import com.blogApplication.blogApp.entities.User;
//import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
//import com.blogApplication.blogApp.repositories.CategoryRepo;
//import com.blogApplication.blogApp.repositories.PostRepo;
//import com.blogApplication.blogApp.repositories.UserRepo;
//import com.blogApplication.blogApp.services.servicesContract.PostServiceContract;
//import lombok.RequiredArgsConstructor;
//import org.modelmapper.ModelMapper;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class PostServiceImpl implements PostServiceContract {
//
//    private  final PostRepo postRepo;
//    private final UserRepo userRepo;
//    private final CategoryRepo categoryRepo;
//    private final ModelMapper modelMapper;
//
//
//
//    @Override
//    public  List<PostDto> getAllPosts() {
//        List<Post> posts = postRepo.findAll();
//        if (posts.isEmpty()) {
//            throw new ResourceNotFoundException("Post","There is no post found",null);
//        }
//        return posts.stream().map(post -> modelMapper.map(post,PostDto.class))
//                .collect(Collectors.toList());
//    }
//    @Override
//    public PostDto getPost(long id) {
//        Post foundPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
//        return modelMapper.map(foundPost, PostDto.class);
//    }
//
//    @Override
//    public PostDto createPost(PostDto postDto,long authorId, long categoryId) {
//
//
//        User user = userRepo.findById(authorId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException("User","id",authorId));
//
//        Category category = categoryRepo.findById(categoryId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException("Category","id",categoryId));
//        Post postCreated = modelMapper.map(postDto, Post.class);
//        postCreated.setAuthor(user);
//        postCreated.setCategory(category);
//        postCreated.setImageName("post.png");
//        Post savedPost = postRepo.save(postCreated);
//        PostDto responseDto = modelMapper.map(savedPost, PostDto.class);
//        responseDto.setAuthor(user.getUsername());
//        responseDto.setAuthorId(savedPost.getAuthor().getId());
//        responseDto.setCategoryId(savedPost.getCategory().getId());
//        return responseDto;
//
//    }
//
//    @Override
//    public PostDto updatePost(PostDto postDto, long id) {
//        Post existingPost = postRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
//
//        modelMapper.map(postDto, existingPost);
//        Post updatedPost = postRepo.save(existingPost);
//        return modelMapper.map(updatedPost, PostDto.class);
//    }
//
//    @Override
//    public PostDto deletePostById(long id) {
//        Post deletedPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
//        postRepo.delete(deletedPost);
//        return modelMapper.map(deletedPost, PostDto.class);
//    }
//
//
//    // method to get all posts in authored by a certain user
//    @Override
//    public Page<PostDto> getPostsByUser(long userId, int pageNumber, int pageSize, Sort sort) {
//        User user = userRepo.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
//
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
//
//        Page<Post> PostsByUser = postRepo.findAllByAuthor(user,pageable);
//
//        return PostsByUser.map(post -> modelMapper.map(post, PostDto.class));
//    }
//
//    // method to get all posts in a certain category
//
//    public Page<PostDto> getPostsByCategory(long categoryId, int pageNumber, int pageSize, Sort sort) {
//        Category category = categoryRepo.findById(categoryId)
//                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
//
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
//
//        Page<Post> PostsByCat = postRepo.findAllByCategory(category, pageable);
//
//        return PostsByCat.map(post -> modelMapper.map(post,PostDto.class));
//    }
//
//    // method to search posts using keyword
//
//    @Override
//    public Page<PostDto> searchPosts(
//            String keyword,
//            int pageNumber,
//            int pageSize,
//            Sort sort
//    ) {
//
//        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
//
//        Page<Post> searchedPosts = postRepo
//                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
//                        keyword,
//                        keyword,
//                        pageable
//                );
//
//        return searchedPosts.map(post -> modelMapper.map(post, PostDto.class));
//    }
//
//
//
//}
package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.dto.postDto.PostResponseDto;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostServiceContract {

    private final PostRepo postRepo;
    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;

    // Helper method to convert Post -> PostResponseDto
    private PostResponseDto mapToResponseDto(Post post) {
        PostResponseDto.AuthorDto authorDto = new PostResponseDto.AuthorDto(
                post.getAuthor().getUsername(),
                post.getAuthor().getProfilePicture()
        );

        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory().getTitle(),
                post.getCreatedAt(),
                authorDto
        );
    }

//    @Override
//    public List<PostResponseDto> getAllPosts() {
//        List<Post> posts = postRepo.findAll();
//        if (posts.isEmpty()) {
//            throw new ResourceNotFoundException("Post", "There is no post found", null);
//        }
//        return posts.stream()
//                .map(this::mapToResponseDto)
//                .collect(Collectors.toList());
//    }


    @Override
    public Page<PostResponseDto> getAllPosts(int pageNumber, int pageSize, Sort sort, String search) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Post> postsPage;

        if (search != null && !search.isEmpty()) {
            postsPage = postRepo.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(search, search, pageable);
        } else {
            postsPage = postRepo.findAll(pageable);
        }

        // Convert Post → PostResponseDto
        return postsPage.map(this::mapToResponseDto);
    }

    @Override
    public PostResponseDto getPost(long id) {
        Post foundPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToResponseDto(foundPost);
    }

    @Override
    public PostResponseDto createPost(PostDto postDto, long authorId, long categoryId) {
        User user = userRepo.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        Post post = modelMapper.map(postDto, Post.class);
        post.setAuthor(user);
        post.setCategory(category);
        post.setImageName("post.png"); // optional
        Post savedPost = postRepo.save(post);

        return mapToResponseDto(savedPost);
    }

    @Override
    public PostResponseDto updatePost(PostDto postDto, long id) {
        Post existingPost = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        modelMapper.map(postDto, existingPost);
        Post updatedPost = postRepo.save(existingPost);

        return mapToResponseDto(updatedPost);
    }

    @Override
    public PostResponseDto deletePostById(long id) {
        Post post = postRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        postRepo.delete(post);
        return mapToResponseDto(post);
    }

    @Override
    public Page<PostResponseDto> getPostsByUser(long userId, int pageNumber, int pageSize, Sort sort) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> postsByUser = postRepo.findAllByAuthor(user, pageable);

        return postsByUser.map(this::mapToResponseDto);
    }

    @Override
    public Page<PostResponseDto> getPostsByCategory(long categoryId, int pageNumber, int pageSize, Sort sort) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> postsByCategory = postRepo.findAllByCategory(category, pageable);

        return postsByCategory.map(this::mapToResponseDto);
    }

    @Override
    public Page<PostResponseDto> searchPosts(String keyword, int pageNumber, int pageSize, Sort sort) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> searchedPosts = postRepo
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword, pageable);

        return searchedPosts.map(this::mapToResponseDto);
    }
}
