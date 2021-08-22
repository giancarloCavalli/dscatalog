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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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
import com.gcavalli.dscatalog.tests.TokenUtil;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductResourceTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ProductService service;
	
	@Autowired
	private ObjectMapper objMapper;
	
	@Autowired
	private TokenUtil tokenUtil;

	private long existingId;
	private long nonExistingId;
	private ProductDTO objDto;
	private PageImpl<ProductDTO> page;
	private long associatedId;
	
	private String username;
	private String password;

	@BeforeEach
	void setUp() throws Exception {
		existingId = 1L;
		nonExistingId = 1_000L;
		associatedId = 2L;
		objDto = Factory.createProductDTO();
		page = new PageImpl<>(List.of(objDto));
		
		username = "maria@gmail.com";
		password = "123456";

		when(service.findAllPaged(any(Pageable.class), any(), any())).thenReturn(page);

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
		String accessToken = tokenUtil.obtainAccessToken(mockMvc, username, password);
		
		String jsonBody = objMapper.writeValueAsString(objDto);
		
		mockMvc.perform(post("/products")
			.header("Authorization", "Bearer" + accessToken)
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
		String accessToken = tokenUtil.obtainAccessToken(mockMvc, username, password);
		
		String jsonBody = objMapper.writeValueAsString(objDto);
		
		mockMvc.perform(put("/products/{id}", existingId)
			.header("Authorization", "Bearer" + accessToken)
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
		String accessToken = tokenUtil.obtainAccessToken(mockMvc, username, password);
		
		String jsonBody = objMapper.writeValueAsString(objDto);
		
		mockMvc.perform(put("/products/{id}", nonExistingId)
			.header("Authorization", "Bearer" + accessToken)
			.content(jsonBody)
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON))
			.andExpect(status().isNotFound());
	}
	
	@Test
	public void deleteShouldReturnNoContentWhenIdExists() throws Exception {
		String accessToken = tokenUtil.obtainAccessToken(mockMvc, username, password);
		
		mockMvc.perform(delete("/products/{id}", existingId)
			.header("Authorization", "Bearer" + accessToken))
			.andExpect(status().isNoContent());
	}
	
	@Test
	public void deleteShouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
		String accessToken = tokenUtil.obtainAccessToken(mockMvc, username, password);
		
		mockMvc.perform(delete("/products/{id}", nonExistingId)
			.header("Authorization", "Bearer" + accessToken))
			.andExpect(status().isNotFound());
	}
	
	@Test
	public void deleteShouldReturnNotFoundWhenIdDoesIsAssociated() throws Exception {
		String accessToken = tokenUtil.obtainAccessToken(mockMvc, username, password);
		
		mockMvc.perform(delete("/products/{id}", associatedId)
			.header("Authorization", "Bearer" + accessToken))
			.andExpect(status().isBadRequest());
	}

	@Test
	public void findAllShouldReturnProductDTOPage() throws Exception {
		Pageable pageable = PageRequest.of(0, 10);

		Page<ProductDTO> resPage = service.findAllPaged(pageable, 0L, "");

		assertNotNull(resPage);
		mockMvc.perform(get("/products").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
	}

}
