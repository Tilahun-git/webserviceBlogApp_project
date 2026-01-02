package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.services.servicesContract.CategoryServiceContract;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryServiceContract {
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;


    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepo.findAll();
        if(categories.isEmpty()){
            throw new ResourceNotFoundException("Category","category not found",null);
        }
        return categories.stream().map(category -> modelMapper.map(category,CategoryDto.class)).collect(Collectors.toList());
    }

    @Override
    public CategoryDto getCategoryById(long id) {
        Category categoryFound = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
        return modelMapper.map(categoryFound, CategoryDto.class);
    }

    @Override
    @PreAuthorize("hasAuthority('CREATE_CATEGORY')")
    public CategoryDto createCategory(CategoryDto categoryDto) {

        if (categoryRepo.existsByTitle(categoryDto.getTitle())) {
            throw new RuntimeException("Category with title '" + categoryDto.getTitle() + "' already exists");
        }

        Category categoryTobeCreated = modelMapper.map(categoryDto, Category.class);
        categoryRepo.save(categoryTobeCreated);
        return modelMapper.map(categoryTobeCreated, CategoryDto.class);
    }


    @Override
    @PreAuthorize("hasAuthority('DELETE_CATEGORY')")
    public CategoryDto deleteCategory(long id) {
        Category  deletedCategory = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
        categoryRepo.delete(deletedCategory);
        return modelMapper.map(deletedCategory, CategoryDto.class);

    }

}
