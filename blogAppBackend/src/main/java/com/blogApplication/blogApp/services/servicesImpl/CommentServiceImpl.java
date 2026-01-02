package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.commentDto.CommentRequestDto;
import com.blogApplication.blogApp.dto.commentDto.CommentResponseDto;
import com.blogApplication.blogApp.entities.Comment;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CommentRepo;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.CommentServiceContract;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentServiceContract {


    private final CommentRepo commentRepo;
    private final PostRepo postRepo;
    private final UserRepo userRepo;
    private final ModelMapper modelMapper;


    @Override
    @PreAuthorize("hasAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_COMMENT_POST)")
    public CommentResponseDto addComment(long postId, long userId, CommentRequestDto commentDto) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUser(user);
        comment.setPost(post);

        Comment savedComment = commentRepo.save(comment);

        CommentResponseDto response = modelMapper.map(savedComment, CommentResponseDto.class);
        response.setUsername(user.getUsername());
        response.setPostId(post.getId());

        return response;
    }


    // Update comment
    @Override
    @PreAuthorize("hasAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_COMMENT_POST)")
    public CommentResponseDto updateComment(long commentId, long userId, CommentRequestDto commentDto) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this comment");
        }

        comment.setContent(commentDto.getContent());
        Comment updated = commentRepo.save(comment);

        CommentResponseDto response = modelMapper.map(updated, CommentResponseDto.class);
        response.setUsername(updated.getUser().getUsername());
        response.setPostId(updated.getPost().getId());
        return response;
    }

    // Delete comment
    @Override
    @PreAuthorize("hasAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_COMMENT_POST)")
    public void deleteComment(long commentId, long userId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepo.delete(comment);
    }


    @Override
    public List<CommentResponseDto> getCommentsByPostId(long postId) {
        List <Comment> comments = commentRepo.findByPostIdOrderByCreatedAtDesc(postId);
        return comments.stream().map(comment -> modelMapper.map(comment, CommentResponseDto.class)).collect(Collectors.toList());

    }






}
