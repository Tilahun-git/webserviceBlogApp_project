package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.userDto.*;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceContract userService;

    @GetMapping("/profile")

    public ResponseEntity<ApiResponse<UserResponseDto>> getUser() {
        UserResponseDto user = userService.getUser();
        return ResponseEntity.ok(new ApiResponse<>(true, "User fetched successfully", user));
    }


    @PutMapping("/profile/update")
    public ResponseEntity<ApiResponse<UserUpdateDto>> updateProfile(
            @RequestPart("data") UserUpdateDto userDto,
            @RequestPart(value = "file", required = false) MultipartFile profileMedia
    ) {
        UserUpdateDto updatedUser = userService.updateProfile(userDto, profileMedia);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedUser));
    }

    @PutMapping("/{username}/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable String username,
            @RequestBody UserChangePassword changePasswordDto
    ) {
        userService.changePassword(username, changePasswordDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null));
    }

    @PostMapping("/password/reset-token")
    public ResponseEntity<ApiResponse<String>> generatePasswordResetToken(@RequestParam String email) {
        String token = userService.generatePasswordResetToken(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset token generated", token));
    }

    @PostMapping("/password/validate-token")
    public ResponseEntity<ApiResponse<User>> validatePasswordResetToken(
            @RequestParam String email,
            @RequestParam Long token
    ) {
        User user = userService.validatePasswordResetToken(email, token);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset token validated", user));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<ApiResponse<Void>> resetForgottenPassword(
            @RequestParam String email,
            @RequestParam String newPassword,
            @RequestParam String confirmNewPassword
    ) {
        userService.resetForgottenPassword(email, newPassword, confirmNewPassword);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successfully", null));
    }

    @GetMapping("/{id}/permissions")
    public ResponseEntity<ApiResponse<Set<String>>> getUserPermissions(@PathVariable Long id) {
        Set<String> permissions = userService.getUserPermissions(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User permissions fetched successfully", permissions));
    }
}
