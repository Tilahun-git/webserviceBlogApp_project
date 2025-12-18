package com.blogApplication.blogApp.controllers;


import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.services.servicesImpl.CategoryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private CategoryServiceImpl categoryServiceImpl;
    public CategoryController(CategoryServiceImpl categoryServiceImpl) {
        this.categoryServiceImpl = categoryServiceImpl;
    }

    @GetMapping("/categories-list")
    public List<CategoryDto> getAllCategories() {
        return categoryServiceImpl.getAllCategories();
    }
    @PostMapping("/addCategory")
    public ResponseEntity<CategoryDto> addCategory(@RequestBody CategoryDto categoryDto) {
        return new ResponseEntity <> (categoryServiceImpl.createCategory(categoryDto), HttpStatus.CREATED);
    }
    @GetMapping("category/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable long id) {
        CategoryDto categoryDtoFound = categoryServiceImpl.getCategoryById(id);
        return new ResponseEntity <> (categoryDtoFound, HttpStatus.OK);
    }

    @DeleteMapping("category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable long id) {
        CategoryDto deletedCategory = categoryServiceImpl.deleteCategory(id);
        return  ResponseEntity.ok(Map.of("message","Category deleted successfully","data",deletedCategory));
    }
}
