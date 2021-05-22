package com.gcavalli.dscatalog.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gcavalli.dscatalog.entities.Category;
import com.gcavalli.dscatalog.repositories.CategoryRepository;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepository repo;
	
	public List<Category> findAll() {
		return repo.findAll();
	}
	
}
