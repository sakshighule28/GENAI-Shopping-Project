package com.clothingstore.service;

import com.clothingstore.entity.Category;
import com.clothingstore.repository.CategoryRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;



    @Test
    void testGetAllCategories() {
        Category category1 = new Category();
        category1.setId(1L);
        category1.setName("Men");

        Category category2 = new Category();
        category2.setId(2L);
        category2.setName("Women");

        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        List<Category> result = categoryService.getAllCategories();

        assertEquals(2, result.size());
        assertEquals("Men", result.get(0).getName());
        assertEquals("Women", result.get(1).getName());
    }

    @Test
    void testGetCategoryById() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Men");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        Category result = categoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals("Men", result.getName());
    }

    @Test
    void testGetCategoryByIdNotFound() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        Category result = categoryService.getCategoryById(999L);

        assertNull(result);
    }

    @Test
    void testGetCategoryByName() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Men");

        when(categoryRepository.findByName("Men")).thenReturn(Optional.of(category));

        Category result = categoryService.getCategoryByName("Men");

        assertNotNull(result);
        assertEquals("Men", result.getName());
    }

    @Test
    void testSaveCategory() {
        Category category = new Category();
        category.setName("New Category");

        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        Category result = categoryService.saveCategory(category);

        assertNotNull(result);
        assertEquals("New Category", result.getName());
        verify(categoryRepository).save(category);
    }

    @Test
    void testDeleteCategory() {
        Long categoryId = 1L;

        categoryService.deleteCategory(categoryId);

        verify(categoryRepository).deleteById(categoryId);
    }
}