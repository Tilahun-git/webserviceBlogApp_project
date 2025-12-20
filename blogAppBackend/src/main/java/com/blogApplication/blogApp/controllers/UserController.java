package com.blogApplication.blogApp.controllers;


import com.blogApplication.blogApp.dto.auth.RegisterRequestDTO;
import com.blogApplication.blogApp.dto.userDto.UserResponseDTO;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDTO;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }


    //  GET METHOD TO LIST ALL USERS

    @GetMapping("/user-list")
    public ResponseEntity <List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // POST METHOD TO ADD NEW USER

    @PostMapping("user/addUser")
    public ResponseEntity<UserResponseDTO> addUser(@RequestBody RegisterRequestDTO userDto) {
        return new ResponseEntity<>(userService.createUser(userDto), HttpStatus.CREATED);
    }

    // GET METHOD TO GET SINGLE USER

    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {
        return  ResponseEntity.ok(userService.getUser(id));
    }
    //PUT METHOD TO UPDATE EXISTING USER

    @PutMapping("/user/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserUpdateDTO userDto, @PathVariable Long id) {
        UserResponseDTO updatedUser = userService.updateUser(userDto, id);
        return ResponseEntity.ok(updatedUser);

    }


    // DELETE METHOD TO DELETE BY USING ID

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        UserResponseDTO deletedUser = userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "data", deletedUser));
    }
}
