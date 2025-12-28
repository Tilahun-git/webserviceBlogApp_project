package com.blogApplication.blogApp.dto.userDto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;
}
