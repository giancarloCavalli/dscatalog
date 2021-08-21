package com.gcavalli.dscatalog.repositories;

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
			+ "WHERE (:category IS NULL OR :category IN cat) ")
	Page<Product> findAll(Pageable pageable,Category category);
}
