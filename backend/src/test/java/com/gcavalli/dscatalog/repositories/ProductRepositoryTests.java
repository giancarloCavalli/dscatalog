package com.gcavalli.dscatalog.repositories;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.EmptyResultDataAccessException;

import com.gcavalli.dscatalog.entities.Product;
import com.gcavalli.dscatalog.tests.Factory;

@DataJpaTest
public class ProductRepositoryTests {
	
	private long existingId;
	private long nonExistingId;
	private long countTotalProducts;
	
	@Autowired
	private ProductRepository repo;
	
	@BeforeEach
	void setUp() throws Exception {
		existingId = 1L;
		nonExistingId = 1000L;
		countTotalProducts = 25L;
	}
	
	@Test void findByIdShouldBePresentWhenIdExists() {
		Optional<Product> result = repo.findById(existingId);
		
		assertTrue(result.isPresent());
	}
	
	@Test void findByIdShouldNotBePresentWhenIdDoesNotExist() {
		Optional<Product> result = repo.findById(nonExistingId);
		
		assertFalse(result.isPresent());
	}
	
	@Test
	public void saveShouldPersistWithAutoIncrementWhenIdIsNull() {
		Product product = Factory.createProduct();
		product.setId(null);
		
		product = repo.save(product);
		
		assertNotNull(product.getId());
		assertTrue(product.getId() == countTotalProducts + 1L);
	}
	
	@Test
	public void deleteShouldDeleteObjectWhenIdExists() {
		repo.deleteById(existingId);
		
		Optional<Product> result = repo.findById(existingId);
		assertFalse(result.isPresent());
	}
	
	@Test
	public void deleteShouldThrowEmptyResultDataAccessExceptionWhenIdDoesNotExist() {
		assertThrows(EmptyResultDataAccessException.class, () -> {
			repo.deleteById(nonExistingId);
		});
	}
	
}
