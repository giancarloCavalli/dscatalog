package com.gcavalli.dscatalog.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gcavalli.dscatalog.dto.ProductDTO;
import com.gcavalli.dscatalog.entities.Category;
import com.gcavalli.dscatalog.entities.Product;
import com.gcavalli.dscatalog.repositories.CategoryRepository;
import com.gcavalli.dscatalog.repositories.ProductRepository;
import com.gcavalli.dscatalog.services.exceptions.DatabaseException;
import com.gcavalli.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepository repo;
	
	@Autowired
	private CategoryRepository categoryRepo;
	
	//transactional garante que vai executar completamente ou nada. ReadOnly aumenta a performance dos selects (não da locking em operações de leitura).
	@Transactional(readOnly = true)
	public List<ProductDTO> findAll() {
		return repo.findAll()
				.stream().map(x -> new ProductDTO(x)).collect(Collectors.toList());
	}

	@Transactional
	public ProductDTO findById(Long id) {
		Optional<Product> obj = repo.findById(id);
		Product entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		return new ProductDTO(entity, entity.getCategories());
	}
	
	@Transactional
	public ProductDTO insert(ProductDTO dto) {
		Product entity = new Product();
		copyDtoToEntity(dto, entity);
		entity = repo.save(entity);
		return new ProductDTO(entity, entity.getCategories());
	}

	@Transactional
	public ProductDTO update(Long id, ProductDTO dto) {
		try {
			Product entity = repo.getOne(id);
			copyDtoToEntity(dto, entity);
			entity = repo.save(entity);
			return new ProductDTO(entity, entity.getCategories());
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Id "+id+" not found");
		}
	}

	public void delete(Long id) {
		try {
			repo.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("Id "+id+" not found");
		} catch (DataIntegrityViolationException dive) {
			throw new DatabaseException("Integrity violation");
		}
	}

	public Page<ProductDTO> findAllPaged(Pageable pageable) {
		Page<Product> page = repo.findAll(pageable);
		return page.map(x -> new ProductDTO(x));
	}
	
	private void copyDtoToEntity(ProductDTO dto, Product entity) {
		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setDate(dto.getDate());
		entity.setImgUrl(dto.getImgUrl());
		entity.setPrice(dto.getPrice());
		
		entity.getCategories().clear();
		dto.getCategories().forEach(categoryDto -> {
			Category category = categoryRepo.getOne(categoryDto.getId());
			entity.getCategories().add(category);
		});
	}
	
}
