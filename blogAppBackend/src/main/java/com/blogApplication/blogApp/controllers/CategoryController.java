package com.blogApplication.blogApp.controllers;


import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.services.servicesImpl.CategoryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    @Autowired
    private final CategoryServiceImpl categoryServiceImpl;

    // GET TO RETRIEVE ALL CATEGORIES
    @GetMapping("/categories-list")
    public List<CategoryDto> getAllCategories() {
        return categoryServiceImpl.getAllCategories();
    }

    // POST METHOD TO ADD NEW CATEGORY
    @PostMapping("/addCategory")
    public ResponseEntity<CategoryDto> addCategory(@RequestBody CategoryDto categoryDto) {
        return new ResponseEntity <> (categoryServiceImpl.createCategory(categoryDto), HttpStatus.CREATED);
    }

    // GET METHOD TO RETRIEVE SINGLE CATEGORY
    @GetMapping("category/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable long id) {
        CategoryDto categoryDtoFound = categoryServiceImpl.getCategoryById(id);
        return new ResponseEntity <> (categoryDtoFound, HttpStatus.OK);
    }

    // DELETE METHOD TO DELETE CATEGORY

    @DeleteMapping("category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable long id) {
        CategoryDto deletedCategory = categoryServiceImpl.deleteCategory(id);
        return  ResponseEntity.ok(Map.of("message","Category deleted successfully","data",deletedCategory));
    }


    @GetMapping("/categories/public")
    public Page<CategoryDto> getAllCategories(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return categoryServiceImpl.getAllCategoriesByPage(
                pageNumber, pageSize, sort
        );
    }



    @GetMapping("/public/search")
    public Page<CategoryDto> searchCategories(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return categoryServiceImpl.searchCategories(
                keyword, pageNumber, pageSize, sort
        );
    }
}
