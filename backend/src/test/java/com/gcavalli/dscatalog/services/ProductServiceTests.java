package com.gcavalli.dscatalog.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.gcavalli.dscatalog.dto.CategoryDTO;
import com.gcavalli.dscatalog.dto.ProductDTO;
import com.gcavalli.dscatalog.entities.Category;
import com.gcavalli.dscatalog.entities.Product;
import com.gcavalli.dscatalog.repositories.CategoryRepository;
import com.gcavalli.dscatalog.repositories.ProductRepository;
import com.gcavalli.dscatalog.services.exceptions.DatabaseException;
import com.gcavalli.dscatalog.services.exceptions.ResourceNotFoundException;
import com.gcavalli.dscatalog.tests.Factory;

@ExtendWith(SpringExtension.class)
public class ProductServiceTests {

	@InjectMocks
	private ProductService service;
	
	@Mock
	private ProductRepository repo;
	
	@Mock
	private CategoryRepository categoryRepo;
	
	private long existingId;
	private long nonExistingId;
	private long associatedId;
	private Product obj;
	private ProductDTO objDto;
	private PageImpl<Product> page;
	private Category category;
	private CategoryDTO categoryDto;
	
	
	@BeforeEach
	void setUp() throws Exception {
		existingId = 1L;
		nonExistingId = 1_000L;
		associatedId = 2L;
		obj = Factory.createProduct();
		objDto = Factory.createProductDTO();
		page = new PageImpl<>(List.of(obj));
		category = Factory.createCategory();
		categoryDto = Factory.createCategoryDTO();
		
		Mockito.when(repo.findById(existingId)).thenReturn(Optional.of(obj));
		Mockito.when(repo.findById(nonExistingId)).thenReturn(Optional.empty());
		Mockito.when(repo.save(ArgumentMatchers.any())).thenReturn(obj);

		Mockito.when(repo.getOne(existingId)).thenReturn(obj);
		Mockito.when(repo.getOne(nonExistingId)).thenThrow(EntityNotFoundException.class);
		Mockito.when(categoryRepo.getOne(categoryDto.getId())).thenReturn(category);
		
		Mockito.doReturn(page).when(repo).findAll(ArgumentMatchers.any(Pageable.class));
		
		Mockito.doNothing().when(repo).deleteById(existingId);
		Mockito.doThrow(EmptyResultDataAccessException.class).when(repo).deleteById(nonExistingId);
		Mockito.doThrow(DataIntegrityViolationException.class).when(repo).deleteById(associatedId);
	}
	
	@Test
	public void findAllPagedShouldReturnProductDTOPage() {
		Pageable pageable = PageRequest.of(0, 10);
		
		Page<ProductDTO> result = service.findAllPaged(pageable);
		
		assertNotNull(result);
		Mockito.verify(repo, Mockito.times(1)).findAll(pageable);
	}
	
	@Test
	public void findByIdShouldReturnProductDTOWhenIdExists() {
		ProductDTO resDto = service.findById(existingId);
		
		assertNotNull(resDto);
		Mockito.verify(repo, Mockito.times(1)).findById(existingId);
	}
	
	@Test
	public void findByIdShouldThrowResourceNotFoundExceptionWhenIdDoesNotExist() {
		assertThrows(ResourceNotFoundException.class, () -> {
			service.findById(nonExistingId);
		});
		Mockito.verify(repo, Mockito.times(1)).findById(nonExistingId);
	}
	
	@Test
	public void updateShouldReturnProductDTOWhenIdExists() {
		ProductDTO resDto = service.update(existingId, objDto);
		
		assertNotNull(resDto);
		Mockito.verify(repo, times(1)).save(obj);
	}
	
	@Test
	public void updateShouldThrowResourceNotFoundExceptionWhenIdDoesNotExist() {
		assertThrows(ResourceNotFoundException.class, () -> {
			service.update(nonExistingId, objDto);
		});
		
		Mockito.verify(repo, times(1)).getOne(nonExistingId);
		Mockito.verify(categoryRepo, times(0)).getOne(existingId);
	}
	
	@Test
	public void deleteShouldDoNothingWhenIdExists() {
		assertDoesNotThrow(() -> {
			service.delete(existingId);
		});
		
		Mockito.verify(repo, Mockito.times(1)).deleteById(existingId);
	}
	
	@Test
	public void deleteShouldThrowResourceNotFoundExceptionWhenIdDoesNotExist() {
		assertThrows(ResourceNotFoundException.class, () -> {
			service.delete(nonExistingId);
		});
		
		Mockito.verify(repo, Mockito.times(1)).deleteById(nonExistingId);
	}
	
	@Test
	public void deleteShouldThrowDatabaseExceptionWhenIdDoesNotExist() {
		assertThrows(DatabaseException.class, () -> {
			service.delete(associatedId);
		});
		
		Mockito.verify(repo, Mockito.times(1)).deleteById(associatedId);
	}
	
}
