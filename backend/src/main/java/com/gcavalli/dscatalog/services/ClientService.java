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

import com.gcavalli.dscatalog.dto.ClientDTO;
import com.gcavalli.dscatalog.entities.Client;
import com.gcavalli.dscatalog.repositories.ClientRepository;
import com.gcavalli.dscatalog.services.exceptions.DatabaseException;
import com.gcavalli.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class ClientService {
	
	@Autowired
	private ClientRepository repo;
	
	//transactional garante que vai executar completamente ou nada. ReadOnly aumenta a performance dos selects (não da locking em operações de leitura).
	@Transactional(readOnly = true)
	public List<ClientDTO> findAll() {
		return repo.findAll()
				.stream().map(x -> new ClientDTO(x)).collect(Collectors.toList());
	}

	@Transactional
	public ClientDTO findById(Long id) {
		Optional<Client> obj = repo.findById(id);
		Client entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		return new ClientDTO(entity);
	}
	
	@Transactional
	public ClientDTO insert(ClientDTO dto) {
		Client entity = new Client();
		copyDtoToEntity(dto, entity);
		entity = repo.save(entity);
		return new ClientDTO(entity);
	}

	@Transactional
	public ClientDTO update(Long id, ClientDTO dto) {
		try {
			Client entity = repo.getOne(id);
			copyDtoToEntity(dto, entity);
			entity = repo.save(entity);
			return new ClientDTO(entity);
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

	public Page<ClientDTO> findAllPaged(Pageable pageable) {
		Page<Client> page = repo.findAll(pageable);
		return page.map(x -> new ClientDTO(x));
	}
	
	private void copyDtoToEntity(ClientDTO dto, Client entity) {
		entity.setName(dto.getName());
		entity.setCpf(dto.getCpf());
		entity.setIncome(dto.getIncome());
		entity.setBirthDate(dto.getBirthDate());
		entity.setChildren(dto.getChildren());
	}
	
}
