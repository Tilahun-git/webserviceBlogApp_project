package com.blogApplication.blogApp.dto.roleDto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RoleAssignDto {
    @NotBlank(message = "Role name is required")
    private String roleName;

    private LocalDateTime expiresAt;
}
