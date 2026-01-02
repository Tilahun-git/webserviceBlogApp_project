package com.blogApplication.blogApp.dto.userDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDto {

                @NotBlank(message = "Token is required")
                private String token;

                @NotBlank(message = "New password is required")
                @Pattern(
                        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
                        message = "Password must be at least 8 characters with uppercase, lowercase, number and special character"
                )
                private String newPassword;
        }


