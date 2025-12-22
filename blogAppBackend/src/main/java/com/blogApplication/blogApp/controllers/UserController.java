package com.blogApplication.blogApp.controllers;


import com.blogApplication.blogApp.dto.userDto.UserDto;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity <List<UserDto>> getAllUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    // POST METHOD TO ADD NEW USER

    @PostMapping("user/addUser")
    public ResponseEntity<UserDto> addUser(@RequestBody UserDto userDto) {


        return new ResponseEntity<>(userService.createUser(userDto), HttpStatus.CREATED);
    }

    // GET METHOD TO GET SINGLE USER

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable long id) {

        return  ResponseEntity.ok(userService.getUser(id));
    }
    //PUT METHOD TO UPDATE EXISTING USER

    @PutMapping("/user/{id}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto, @PathVariable long id) {
        UserDto updatedUser = userService.updateUser(userDto, id);
        return ResponseEntity.ok(updatedUser);

    }


    // DELETE METHOD TO DELETE BY USING ID

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        UserDto deletedUser = userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
