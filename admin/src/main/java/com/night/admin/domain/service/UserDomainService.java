package com.night.admin.domain.service;

import com.night.admin.domain.entity.User;
import com.night.admin.infrastructure.persistence.entity.UserEntity;
import com.night.admin.infrastructure.persistence.repository.UserRepository;
import com.night.admin.application.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserDomainService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    public User findById(Long id) {
        log.info("Fetching user with id: {}", id);
        
        Optional<UserEntity> optional = userRepository.findById(id);
        if (optional.isPresent()) {
            // 将基础设施层的实体转换为领域实体
            UserEntity entity = optional.get();
            User domainUser = new User();
            domainUser.setId(entity.getId());
            domainUser.setUsername(entity.getUsername());
            domainUser.setEmail(entity.getEmail());
            domainUser.setPassword(entity.getPassword());
            domainUser.setFullName(entity.getFullName());
            domainUser.setUid(entity.getUid());
            domainUser.setIsActive(entity.getIsActive());
            domainUser.setCreatedAt(entity.getCreatedAt());
            domainUser.setUpdatedAt(entity.getUpdatedAt());
            return domainUser;
        } else {
            return null;
        }
    }
    
    public User save(User user) {
        UserEntity entity = new UserEntity();
        entity.setId(user.getId());
        entity.setUsername(user.getUsername());
        entity.setEmail(user.getEmail());
        entity.setPassword(user.getPassword());
        entity.setFullName(user.getFullName());
        entity.setUid(user.getUid());
        entity.setIsActive(user.getIsActive());
        
        UserEntity savedEntity = userRepository.save(entity);
        
        User result = new User();
        result.setId(savedEntity.getId());
        result.setUsername(savedEntity.getUsername());
        result.setEmail(savedEntity.getEmail());
        result.setPassword(savedEntity.getPassword());
        result.setFullName(savedEntity.getFullName());
        result.setUid(savedEntity.getUid());
        result.setIsActive(savedEntity.getIsActive());
        result.setCreatedAt(savedEntity.getCreatedAt());
        result.setUpdatedAt(savedEntity.getUpdatedAt());
        
        return result;
    }
}