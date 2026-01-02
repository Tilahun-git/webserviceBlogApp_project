package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.services.servicesContract.CategoryServiceContract;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryServiceContract categoryService;

    // ================= GET ALL CATEGORIES =================
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        try {
            List<CategoryDto> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(new ApiResponse<>(true, "Categories fetched successfully", categories));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to fetch categories: " + e.getMessage(), null));
        }
    }

    // ================= ADD NEW CATEGORY =================
    @PostMapping("/addCategory")
    public ResponseEntity<ApiResponse<CategoryDto>> addCategory(@RequestBody CategoryDto categoryDto) {
        try {
            CategoryDto createdCategory = categoryService.createCategory(categoryDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Category created successfully", createdCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to create category: " + e.getMessage(), null));
        }
    }

    // ================= GET SINGLE CATEGORY =================
    @GetMapping("/category/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategory(@PathVariable long id) {
        try {
            CategoryDto category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Category fetched successfully", category));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to fetch category: " + e.getMessage(), null));
        }
    }

    // ================= DELETE CATEGORY =================
    @DeleteMapping("/category/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> deleteCategory(@PathVariable long id) {
        try {
            CategoryDto deletedCategory = categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Category deleted successfully", deletedCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to delete category: " + e.getMessage(), null));
        }
    }
}
