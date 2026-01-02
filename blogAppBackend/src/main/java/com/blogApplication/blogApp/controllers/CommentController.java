package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.commentDto.CommentRequestDto;
import com.blogApplication.blogApp.dto.commentDto.CommentResponseDto;
import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.services.servicesContract.CommentServiceContract;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentServiceContract commentService;

    // ================= ADD COMMENT =================
    @PostMapping("/comment/user/{postId}")
    public ResponseEntity<ApiResponse<CommentResponseDto>> addComment(
            @PathVariable long postId,
            @RequestParam long userId,
            @RequestBody CommentRequestDto commentDto
    ) {
        try {
            CommentResponseDto addedComment = commentService.addComment(postId, userId, commentDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Comment added successfully", addedComment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to add comment: " + e.getMessage(), null));
        }
    }

    // ================= UPDATE COMMENT =================
    @PutMapping("/comment/user/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponseDto>> updateComment(
            @PathVariable long commentId,
            @RequestParam long userId,
            @RequestBody CommentRequestDto commentDto
    ) {
        try {
            CommentResponseDto updatedComment = commentService.updateComment(commentId, userId, commentDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Comment updated successfully", updatedComment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to update comment: " + e.getMessage(), null));
        }
    }

    // ================= DELETE COMMENT =================
    @DeleteMapping("/comment/user/{commentId}")
    public ResponseEntity<ApiResponse<String>> deleteComment(
            @PathVariable long commentId,
            @RequestParam long userId
    ) {
        try {
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Comment deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to delete comment: " + e.getMessage(), null));
        }
    }

    // ================= GET COMMENTS BY POST =================
    @GetMapping("/public/post/{postId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponseDto>>> getCommentsByPost(@PathVariable long postId) {
        try {
            List<CommentResponseDto> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Comments fetched successfully", comments));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to fetch comments: " + e.getMessage(), null));
        }
    }
}
