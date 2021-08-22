package com.gcavalli.dscatalog.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import com.gcavalli.dscatalog.dto.ProductDTO;
import com.gcavalli.dscatalog.repositories.ProductRepository;
import com.gcavalli.dscatalog.services.exceptions.ResourceNotFoundException;

@SpringBootTest
@Transactional
public class ProductServiceIT {

	@Autowired
	private ProductService service;
	
	@Autowired ProductRepository repository;
	
	private Long existingId;
	private Long nonExistingId;
	private Long countTotalProducts;
	
	@BeforeEach
	void setup() throws Exception {
		existingId = 1L;
		nonExistingId = 1_000L;
		countTotalProducts = repository.count();
	}
	
	@Test
	public void deleteShouldDeleteResourceWhenIdExists() {
		service.delete(existingId);
		
		assertEquals(countTotalProducts - 1, repository.count());
	}
	
	@Test
	public void deleteShouldThrowResourceNotFoundExceptionWhenIdDoesNotExist() {
		assertThrows(ResourceNotFoundException.class, () -> {
			service.delete(nonExistingId);
		});
	}
	
	@Test
	public void findAllPagedShouldReturnPage0Size10() {
		PageRequest pageRequest = PageRequest.of(0, 10);
		
		Page<ProductDTO> result = service.findAllPaged(pageRequest, 0L, "");
		
		assertFalse(result.isEmpty());
		assertEquals(0, result.getNumber());
		assertEquals(10, result.getSize());
		assertEquals(countTotalProducts, result.getTotalElements());
	}
	
	@Test
	public void findAllPagedShouldReturnEmptyWhenPageDoesNotExists() {
		PageRequest pageRequest = PageRequest.of(50, 10);
		
		Page<ProductDTO> result = service.findAllPaged(pageRequest, 0L, "");
		
		assertTrue(result.isEmpty());
	}
	
	@Test
	public void findAllPagedShouldReturnSortedPageWhenSortByName() {
		PageRequest pageRequest = PageRequest.of(0, 10, Sort.by("name"));
		
		Page<ProductDTO> result = service.findAllPaged(pageRequest, 0L, "");
		
		assertFalse(result.isEmpty());
		assertEquals("Macbook Pro", result.getContent().get(0).getName());
		assertEquals("PC Gamer", result.getContent().get(1).getName());
		assertEquals("PC Gamer Alfa", result.getContent().get(2).getName());
	}
	
}
