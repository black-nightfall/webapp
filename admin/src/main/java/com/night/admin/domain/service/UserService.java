package com.night.admin.domain.service;

import com.night.admin.infrastructure.persistence.repository.UserRepository;
import com.night.admin.domain.entity.User;
import com.night.admin.exception.BusinessException;
import com.night.common.dto.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getUserById(Long id) {
        log.info("Fetching user with id: {}", id);
        
        Optional<com.night.admin.infrastructure.persistence.entity.UserEntity> optional = userRepository.findById(id);
        
        if (optional.isPresent()) {
            com.night.admin.infrastructure.persistence.entity.UserEntity entity = optional.get();
            User user = new User();
            user.setId(entity.getId());
            user.setUid(entity.getUid());
            user.setUsername(entity.getUsername());
            user.setEmail(entity.getEmail());
            user.setPassword(entity.getPassword());
            user.setFullName(entity.getFullName());
            user.setIsActive(entity.getIsActive());
            user.setCreatedAt(entity.getCreatedAt());
            user.setUpdatedAt(entity.getUpdatedAt());
            
            log.debug("Found user: {}", user.getUsername());
            return user;
        } else {
            log.warn("User not found with id: {}", id);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
    }
    
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        List<com.night.admin.infrastructure.persistence.entity.UserEntity> entities = userRepository.findAll();
        log.debug("Found {} users", entities.size());
        
        return entities.stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
    }
    
    private User convertToEntity(com.night.admin.infrastructure.persistence.entity.UserEntity entity) {
        User user = new User();
        user.setId(entity.getId());
        user.setUid(entity.getUid());
        user.setUsername(entity.getUsername());
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());
        user.setFullName(entity.getFullName());
        user.setIsActive(entity.getIsActive());
        user.setCreatedAt(entity.getCreatedAt());
        user.setUpdatedAt(entity.getUpdatedAt());
        return user;
    }
}
