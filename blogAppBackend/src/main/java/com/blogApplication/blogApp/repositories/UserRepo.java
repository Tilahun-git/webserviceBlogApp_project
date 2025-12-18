package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
}
