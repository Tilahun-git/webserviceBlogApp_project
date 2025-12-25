package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.commentDto.CommentRequestDto;
import com.blogApplication.blogApp.dto.commentDto.CommentResponseDto;
import com.blogApplication.blogApp.services.servicesImpl.CommentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {


    @Autowired
    private final CommentServiceImpl commentService;




    // Add comment to a post (user must be logged in)
    @PostMapping("/comment/user/{postId}")
    public CommentResponseDto addComment(@PathVariable long postId,
                                         @RequestParam long userId,
                                         @RequestBody CommentRequestDto commentDto) {
        return commentService.addComment(postId, userId, commentDto);
    }

    // Update comment
    @PutMapping("/comment/user/{commentId}")
    public CommentResponseDto updateComment(@PathVariable long commentId,
                                            @RequestParam long userId,
                                            @RequestBody CommentRequestDto commentDto) {
        return commentService.updateComment(commentId, userId, commentDto);
    }


    // Delete comment
    @DeleteMapping("/comment/user/{commentId}")
    public Map<String, String> deleteComment(@PathVariable long commentId,
                                             @RequestParam long userId) {
        commentService.deleteComment(commentId, userId);
        return Map.of("message", "Comment deleted successfully");
    }



    @GetMapping("/public/post/{postId}/comments")
    public Page<CommentResponseDto> getCommentsByPost(
            @PathVariable long postId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {


        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return commentService.getCommentsByPost(
                postId, pageNumber, pageSize, sort);
    }

    @GetMapping("/public/post/{postId}/search")
    public Page<CommentResponseDto> searchCommentsInPost(
            @PathVariable long postId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return commentService.searchCommentsInPost(
                postId, keyword, pageNumber, pageSize, sort
        );
    }
}
