package com.gcavalli.dscatalog.tests;

import java.time.Instant;

import com.gcavalli.dscatalog.dto.CategoryDTO;
import com.gcavalli.dscatalog.dto.ProductDTO;
import com.gcavalli.dscatalog.entities.Category;
import com.gcavalli.dscatalog.entities.Product;

public class Factory {

	public static Product createProduct() {
		Product product = new Product("PeraPhone", "A nice phone!", 2_900.0, "", Instant.parse("2020-07-14T10:00:00Z"));
		product.setId(1L);
		product.getCategories().add(createCategory());
		return product;
	}
	
	public static ProductDTO createProductDTO() {
		Product product = createProduct();
		return new ProductDTO(product, product.getCategories());
	}

	public static Category createCategory() {
		return new Category(2L, "Electronics");
	}

	public static CategoryDTO createCategoryDTO() {
		return new CategoryDTO(createCategory());
	}
}
