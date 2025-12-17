package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.entities.User;

import java.util.List;

public interface UserServiceContract {


    User getUser(long id);
    List<User> getAllUsers();
    User createUser(User user);
}
