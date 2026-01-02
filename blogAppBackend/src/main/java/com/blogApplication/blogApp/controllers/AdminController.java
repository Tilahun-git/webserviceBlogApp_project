package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {



    private final UserServiceContract userService;


    @GetMapping("/counts")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDashboardCounts() {
        Map<String, Long> counts = userService.getDashboardCounts();
        ApiResponse<Map<String, Long>> response = new ApiResponse<>(
                true,
                "Dashboard statistics fetched successfully",
                counts
        );
        return ResponseEntity.ok(response);
    }


    @GetMapping("/users")
//    @PreAuthorize("hasAuthority('VIEW_ALL_USERS')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();

            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
            Page<UserResponseDto> usersPage = userService.getAllUsers(pageable);

            return ResponseEntity.ok(new ApiResponse<>(true, "Users fetched successfully", usersPage));

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Failed to fetch users: " + e.getMessage(), null));
        }
    }
    // -------------------- DELETE USER --------------------
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('DELETE_USER')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Failed to delete user: " + e.getMessage(), null));
        }
    }


    // -------------------- SEARCH USERS --------------------
    @GetMapping("/users/filter")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();

            Page<UserResponseDto> searchResult = userService.searchUsers(keyword, pageNumber, pageSize, sort);

            if (searchResult.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "No users found matching the keyword", searchResult));
            }

            return ResponseEntity.ok(new ApiResponse<>(true, "Search results fetched successfully", searchResult));

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Failed to search users: " + e.getMessage(), null));
        }
    }


    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User activated successfully", null));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable Long id) {
        userService.deActivateUser(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deactivated successfully", null));
    }

    @PutMapping("/{id}/role/grant")
    public ResponseEntity<ApiResponse<UserResponseDto>> grantRole(@PathVariable Long id, @RequestParam String roleName) {
        UserResponseDto user = userService.grantRole(id, roleName);
        return ResponseEntity.ok(new ApiResponse<>(true, "Role granted successfully", user));
    }

    @PutMapping("/{id}/roles/revoke")
    public ResponseEntity<ApiResponse<UserResponseDto>> revokeRole(@PathVariable Long id, @RequestParam String roleName) {
        UserResponseDto user = userService.revokeRole(id, roleName);
        return ResponseEntity.ok(new ApiResponse<>(true, "Role revoked successfully", user));
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUserRoles(@PathVariable Long id, @RequestBody Set<String> roleNames) {
        UserResponseDto user = userService.updateUserRoles(id, roleNames);
        return ResponseEntity.ok(new ApiResponse<>(true, "User roles updated successfully", user));
    }


}
