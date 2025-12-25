package com.night.admin.application.service;

import com.night.admin.domain.service.UserDomainService;
import com.night.admin.domain.entity.User;
import com.night.admin.application.dto.response.UserResponseDTO;
import com.night.admin.application.dto.request.CreateUserRequestDTO;
import com.night.admin.application.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserApplicationService {
    
    private final UserDomainService userDomainService;
    private final UserMapper userMapper;
    
    public UserResponseDTO getUserById(Long id) {
        User user = userDomainService.findById(id);
        if (user != null) {
            return userMapper.toResponseDTO(user);
        }
        throw new RuntimeException("User not found");
    }
    
    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        User user = userMapper.toDomain(request);
        User savedUser = userDomainService.save(user);
        return userMapper.toResponseDTO(savedUser);
    }
}