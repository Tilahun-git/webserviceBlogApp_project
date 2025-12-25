package com.blogApplication.blogApp.controllers;


import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")

//@CrossOrigin(origins = "http://localhost:3000") // allow frontend
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserServiceImpl userService;


    //  GET METHOD TO LIST ALL USERS

    @GetMapping("/list")
    public ResponseEntity <List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // POST METHOD TO ADD NEW USER

    @PostMapping("/user/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody RegisterRequestDto userDto) {

        return new ResponseEntity<>(userService.registerUser(userDto), HttpStatus.CREATED);
    }

    // GET METHOD TO GET SINGLE USER

    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long id) {
        return  ResponseEntity.ok(userService.getUser(id));
    }
    //PUT METHOD TO UPDATE EXISTING USER

    @PutMapping("/user/{id}")
    public ResponseEntity<UserUpdateDto> updateUser(@RequestBody UserUpdateDto userDto, @PathVariable Long id) {
        UserUpdateDto updatedUser = userService.updateUser(userDto, id);
        return ResponseEntity.ok(updatedUser);

    }


    // DELETE METHOD TO DELETE BY USING ID

    @DeleteMapping("/user/admin/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        UserResponseDto deletedUser = userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "data", deletedUser));
    }

    // GET ALL USERS BY PAGINATION AND SORTING WHO CAN ADMIN


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
        return ResponseEntity.ok(
                userService.getAllUsers(pageNumber, pageSize, sort)
        );
    }

    // GET ALL USERS BY SEARCHING WHO CAN ADMIN

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
        return ResponseEntity.ok(
                userService.searchUsers(keyword, pageNumber, pageSize, sort)
        );
    }
}
