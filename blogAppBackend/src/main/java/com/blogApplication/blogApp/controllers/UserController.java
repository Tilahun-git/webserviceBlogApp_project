package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000") // Uncomment if frontend runs on localhost
public class UserController {

    private final UserServiceImpl userService;

    // -------------------- GET ALL USERS --------------------
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // -------------------- REGISTER NEW USER --------------------
    @PostMapping("/user/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody RegisterRequestDto userDto) {
        UserResponseDto createdUser = userService.registerUser(userDto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // -------------------- GET SINGLE USER --------------------
    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long id) {
        UserResponseDto user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    // -------------------- UPDATE USER --------------------
    @PutMapping("/user/{id}")
    public ResponseEntity<UserUpdateDto> updateUser(
            @RequestBody UserUpdateDto userDto,
            @PathVariable Long id
    ) {
        UserUpdateDto updatedUser = userService.updateUser(userDto, id);
        return ResponseEntity.ok(updatedUser);
    }

    // -------------------- DELETE USER --------------------
    @DeleteMapping("/user/admin/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        UserResponseDto deletedUser = userService.deleteUser(id);
        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully", "data", deletedUser)
        );
    }

    // -------------------- PAGINATED & SORTED USERS --------------------
    @GetMapping("/user/admin/users")
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Page<UserResponseDto> usersPage = userService.getAllUsers(pageNumber, pageSize, sort);
        return ResponseEntity.ok(usersPage);
    }

    // -------------------- SEARCH USERS --------------------
    @GetMapping("/public/search")
    public ResponseEntity<Page<UserResponseDto>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Page<UserResponseDto> searchResult = userService.searchUsers(keyword, pageNumber, pageSize, sort);
        return ResponseEntity.ok(searchResult);
    }
}
