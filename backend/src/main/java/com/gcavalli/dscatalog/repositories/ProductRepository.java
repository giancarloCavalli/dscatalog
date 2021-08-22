package com.gcavalli.dscatalog.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gcavalli.dscatalog.entities.Category;
import com.gcavalli.dscatalog.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	@Query("SELECT DISTINCT obj "
			+ "FROM Product obj "
			+ "JOIN obj.categories cat "
			+ "WHERE (COALESCE(:categories) IS NULL OR cat IN :categories) "
			+ "	AND (UPPER(obj.name) LIKE CONCAT('%', UPPER(:name), '%'))")
	Page<Product> findAll(Pageable pageable,List<Category> categories, String name);
	
	@Query("SELECT obj "
			+ "FROM Product obj "
			+ "JOIN FETCH obj.categories "
			+ "WHERE obj IN :products")
	List<Product> findProductsWithCategories(List<Product> products);
}
