package com.blogApplication.blogApp.controllers;


import com.blogApplication.blogApp.dto.UserDto;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }
    @GetMapping("/user-list")
    public List<UserDto> getAllUsers() {

        return userService.getAllUsers();
    }
    @PostMapping("/addUser")
    public UserDto addUser(@RequestBody UserDto userDto) {


        return userService.createUser(userDto);
    }
    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable long id) {

        return userService.getUser(id);
    }
    @PutMapping("/id")
    public UserDto updateUser(@RequestBody UserDto userDto, @PathVariable long id) {
        UserDto updatedUser = userService.updateUser(userDto, id);
        return updatedUser;

    }
}
