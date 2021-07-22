package com.gcavalli.dscatalog.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gcavalli.dscatalog.dto.UserDTO;
import com.gcavalli.dscatalog.dto.UserInsertDTO;
import com.gcavalli.dscatalog.dto.UserUpdateDTO;
import com.gcavalli.dscatalog.entities.Role;
import com.gcavalli.dscatalog.entities.User;
import com.gcavalli.dscatalog.repositories.RoleRepository;
import com.gcavalli.dscatalog.repositories.UserRepository;
import com.gcavalli.dscatalog.services.exceptions.DatabaseException;
import com.gcavalli.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class UserService implements UserDetailsService {
	
	private static Logger logger = LoggerFactory.getLogger(UserService.class);
	
	@Autowired
	private UserRepository repo;
	
	@Autowired
	private RoleRepository roleRepo;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	//transactional garante que vai executar completamente ou nada. ReadOnly aumenta a performance dos selects (não da locking em operações de leitura).
	@Transactional(readOnly = true)
	public List<UserDTO> findAll() {
		return repo.findAll()
				.stream().map(x -> new UserDTO(x)).collect(Collectors.toList());
	}

	@Transactional
	public UserDTO findById(Long id) {
		Optional<User> obj = repo.findById(id);
		User entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		return new UserDTO(entity);
	}
	
	@Transactional
	public UserDTO insert(UserInsertDTO dto) {
		User entity = new User();
		copyDtoToEntity(dto, entity);
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity = repo.save(entity);
		return new UserDTO(entity);
	}

	@Transactional
	public UserDTO update(Long id, UserUpdateDTO dto) {
		try {
			User entity = repo.getOne(id);
			copyDtoToEntity(dto, entity);
			entity = repo.save(entity);
			return new UserDTO(entity);
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

	public Page<UserDTO> findAllPaged(Pageable pageable) {
		Page<User> page = repo.findAll(pageable);
		return page.map(x -> new UserDTO(x));
	}
	
	private void copyDtoToEntity(UserDTO dto, User entity) {
		entity.setFirstName(dto.getFirstName());
		entity.setLastName(dto.getLastName());
		entity.setEmail(dto.getEmail());
		
		entity.getRoles().clear();
		dto.getRoles().forEach(roleDto -> {
			Role role = roleRepo.getOne(roleDto.getId());
			entity.getRoles().add(role);
		});
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = repo.findByEmail(username);
		if (user == null) {
			logger.error("User not found: " + username);
			throw new UsernameNotFoundException("Email not found");
		}
		
		logger.info("User found: " + username);
		return user;
	}
	
}
