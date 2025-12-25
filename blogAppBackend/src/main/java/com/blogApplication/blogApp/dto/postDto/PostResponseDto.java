package com.blogApplication.blogApp.dto.postDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {

    private long id;
    private String title;
    private String content;
    private String category;
    private LocalDateTime createdAt;  // New field

    private AuthorDto author;         // Nested object

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorDto {
        private String username;
        private String profilePicture = null;  // Optional, can be null
    }
}
