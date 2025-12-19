package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category, Long> {

    Optional<Category> findById(long id);

}
