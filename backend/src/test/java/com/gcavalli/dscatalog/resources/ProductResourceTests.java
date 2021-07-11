package com.gcavalli.dscatalog.resources;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gcavalli.dscatalog.dto.ProductDTO;
import com.gcavalli.dscatalog.services.ProductService;
import com.gcavalli.dscatalog.services.exceptions.DatabaseException;
import com.gcavalli.dscatalog.services.exceptions.ResourceNotFoundException;
import com.gcavalli.dscatalog.tests.Factory;

@WebMvcTest(ProductResource.class)
public class ProductResourceTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ProductService service;
	
	@Autowired
	private ObjectMapper objMapper;

	private long existingId;
	private long nonExistingId;
	private ProductDTO objDto;
	private PageImpl<ProductDTO> page;
	private long associatedId;

	@BeforeEach
	void setUp() throws Exception {
		existingId = 1L;
		nonExistingId = 1_000L;
		associatedId = 2L;
		objDto = Factory.createProductDTO();
		page = new PageImpl<>(List.of(objDto));

		when(service.findAllPaged(any(Pageable.class))).thenReturn(page);

		when(service.findById(existingId)).thenReturn(objDto);
		doThrow(ResourceNotFoundException.class).when(service).findById(nonExistingId);
		
		when(service.insert(any())).thenReturn(objDto);

		when(service.update(eq(existingId), any())).thenReturn(objDto);
		doThrow(ResourceNotFoundException.class).when(service).update(eq(nonExistingId), any());
		
		doNothing().when(service).delete(existingId);
		doThrow(ResourceNotFoundException.class).when(service).delete(nonExistingId);
		doThrow(DatabaseException.class).when(service).delete(associatedId);
	}
	
	@Test
	public void findByIdShouldReturnObjectDTOWhenIdExists() throws Exception {
		mockMvc.perform(get("/products/{id}", existingId).accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.name").exists())
			.andExpect(jsonPath("$.description").exists());
	}

	@Test
	public void findByIdShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
		mockMvc.perform(get("/products/{id}", nonExistingId).accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isNotFound());
	}
	
	@Test
	public void insertShouldReturnCreatedAndDTO() throws Exception {
		String jsonBody = objMapper.writeValueAsString(objDto);
		
		mockMvc.perform(post("/products")
			.content(jsonBody)
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.name").exists())
			.andExpect(jsonPath("$.description").exists());
	}
	
	@Test
	public void updateShouldReturnObjectDTOWhenIdExists() throws Exception {
		String jsonBody = objMapper.writeValueAsString(objDto);
		
		mockMvc.perform(put("/products/{id}", existingId)
			.content(jsonBody)
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.name").exists())
			.andExpect(jsonPath("$.description").exists());
	}
	
	@Test
	public void updateShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
		String jsonBody = objMapper.writeValueAsString(objDto);
		
		mockMvc.perform(put("/products/{id}", nonExistingId)
			.content(jsonBody)
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isNotFound());
	}
	
	@Test
	public void deleteShouldReturnNoContentWhenIdExists() throws Exception {
		mockMvc.perform(delete("/products/{id}", existingId))
			.andExpect(status().isNoContent());
	}
	
	@Test
	public void deleteShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
		mockMvc.perform(delete("/products/{id}", nonExistingId))
			.andExpect(status().isNotFound());
	}
	
	@Test
	public void deleteShouldReturnNotFoundWhenIdDoesIsAssociated() throws Exception {
		mockMvc.perform(delete("/products/{id}", associatedId))
			.andExpect(status().isBadRequest());
	}

	@Test
	public void findAllShouldReturnProductDTOPage() throws Exception {
		Pageable pageable = PageRequest.of(0, 10);

		Page<ProductDTO> resPage = service.findAllPaged(pageable);

		assertNotNull(resPage);
		mockMvc.perform(get("/products").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
	}

}
