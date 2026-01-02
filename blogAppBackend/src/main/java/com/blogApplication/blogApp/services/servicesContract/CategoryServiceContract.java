package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface CategoryServiceContract {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(long id);
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto deleteCategory(long id);

}
