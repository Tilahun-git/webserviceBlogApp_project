package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;

import java.util.List;

public interface CategoryServiceContract {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(long id);
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(long id, CategoryDto categoryDto);
    CategoryDto deleteCategory(long id);
}
