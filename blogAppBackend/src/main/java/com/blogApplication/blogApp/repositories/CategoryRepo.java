package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Long> {
}
