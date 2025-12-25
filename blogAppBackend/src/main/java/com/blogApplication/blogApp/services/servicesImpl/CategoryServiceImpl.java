package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.services.servicesContract.CategoryServiceContract;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryServiceContract {
    @Autowired
    private CategoryRepo categoryRepo;
    @Autowired
    private ModelMapper modelMapper;


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
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category categoryTobeCreated = modelMapper.map(categoryDto, Category.class);
        categoryRepo.save(categoryTobeCreated);
        return modelMapper.map(categoryTobeCreated, CategoryDto.class);

    }

    @Override
    public CategoryDto updateCategory(long id, CategoryDto categoryDto) {
        Category categoryTobeUpdated = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
        categoryTobeUpdated.setTitle(categoryDto.getTitle());
        Category updatedCategory = categoryRepo.save(categoryTobeUpdated);
        return modelMapper.map(updatedCategory, CategoryDto.class);
    }

    @Override
    public CategoryDto deleteCategory(long id) {
        Category  deletedCategory = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
        categoryRepo.delete(deletedCategory);
        return modelMapper.map(deletedCategory, CategoryDto.class);

    }

    public Page<CategoryDto> getAllCategoriesByPage(
            int pageNumber,
            int pageSize,
            Sort sort) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Category> page = categoryRepo.findAll(pageable);

        return page.map(category -> modelMapper.map(category, CategoryDto.class));
    }

    @Override
    public Page<CategoryDto> searchCategories(
            String keyword,
            int pageNumber,
            int pageSize,
            Sort sort
    ) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Category> page =
                categoryRepo.findByTitleContainingIgnoreCase(keyword, pageable);

        return page.map(category -> modelMapper.map(category, CategoryDto.class));
    }


}
