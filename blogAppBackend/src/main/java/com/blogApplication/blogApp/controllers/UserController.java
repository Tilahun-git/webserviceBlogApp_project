package com.blogApplication.blogApp.controllers;


import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
<<<<<<< Updated upstream
<<<<<<< Updated upstream
@RequestMapping("/api/users")
=======
=======
>>>>>>> Stashed changes
@RequestMapping("/api")
@RequiredArgsConstructor
>>>>>>> Stashed changes
public class UserController {
    private UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }
    @GetMapping("/user-list")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {


<<<<<<< Updated upstream
<<<<<<< Updated upstream
        return userService.createUser(user);
=======
=======
>>>>>>> Stashed changes
    @PostMapping("/sign-up")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody RegisterRequestDto userDto) {

        return new ResponseEntity<>(userService.registerUser(userDto), HttpStatus.CREATED);
>>>>>>> Stashed changes
    }
    @GetMapping("/{id}")
    public User getUser(@PathVariable long id) {
        return userService.getUser(id);
    }
}
