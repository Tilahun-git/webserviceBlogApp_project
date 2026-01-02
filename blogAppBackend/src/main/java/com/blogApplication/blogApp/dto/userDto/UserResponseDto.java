package com.blogApplication.blogApp.dto.userDto;


import com.blogApplication.blogApp.dto.roleDto.RoleDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
//    private String mediaUrl;
    private String status;
    private Set<RoleDto> roles = new HashSet<>();
//    private Set<String> permissions = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
