package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.CategoryServiceContract;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryServiceContract {
    @Autowired
    private CategoryRepo categoryRepo;


    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepo.findAll();
        if(categories.isEmpty()){
            throw new ResourceNotFoundException("Category","category not found",null);
        }
        return categories.stream().map(this::categoryToCategoryDto).collect(Collectors.toList());
    }

    @Override
    public CategoryDto getCategoryById(long id) {
        Category categoryFound = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
        CategoryDto categoryDto = categoryToCategoryDto(categoryFound);
        return categoryDto;
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category categoryTobeCreated = categoryDtoToCategory(categoryDto);
        categoryRepo.save(categoryTobeCreated);
        CategoryDto categoryCreated = categoryToCategoryDto(categoryTobeCreated);
        return categoryCreated;

    }

    @Override
    public CategoryDto updateCategory(long id, CategoryDto categoryDto) {
        Category categoryTobeUpdated = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
        categoryTobeUpdated.setTitle(categoryDto.getTitle());
        Category updatedCategory = categoryRepo.save(categoryTobeUpdated);
        CategoryDto categoryDtoUpdated = categoryToCategoryDto(updatedCategory);
        return categoryDtoUpdated;
    }

    @Override
    public CategoryDto deleteCategory(long id) {
        Category  deletedCategory = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
        categoryRepo.delete(deletedCategory);
        CategoryDto categoryDto = categoryToCategoryDto(deletedCategory);
        return categoryDto;

    }


    // convert category to categoryDto
    public CategoryDto categoryToCategoryDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setTitle(category.getTitle());
        return categoryDto;
    }

    //convert categoryDto to category
    public Category categoryDtoToCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setId(categoryDto.getId());
        category.setTitle(categoryDto.getTitle());
        return category;
    }
}
