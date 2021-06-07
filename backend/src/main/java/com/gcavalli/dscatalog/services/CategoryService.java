package com.gcavalli.dscatalog.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gcavalli.dscatalog.dto.CategoryDTO;
import com.gcavalli.dscatalog.entities.Category;
import com.gcavalli.dscatalog.repositories.CategoryRepository;
import com.gcavalli.dscatalog.services.exceptions.DatabaseException;
import com.gcavalli.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepository repo;
	
	//transactional garante que vai executar completamente ou nada. ReadOnly aumenta a performance dos selects (não da locking em operações de leitura).
	@Transactional(readOnly = true)
	public List<CategoryDTO> findAll() {
		return repo.findAll()
				.stream().map(x -> new CategoryDTO(x)).collect(Collectors.toList());
	}

	@Transactional
	public CategoryDTO findById(Long id) {
		Optional<Category> obj = repo.findById(id);
		Category entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		return new CategoryDTO(entity);
	}
	
	@Transactional
	public CategoryDTO insert(CategoryDTO dto) {
		Category entity = new Category();
		entity.setName(dto.getName());
		entity = repo.save(entity);
		return new CategoryDTO(entity);
	}
	
	@Transactional
	public CategoryDTO update(Long id, CategoryDTO dto) {
		try {
			Category entity = repo.getOne(id);
			entity.setName(dto.getName());
			entity = repo.save(entity);
			return new CategoryDTO(entity);
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
	
}
