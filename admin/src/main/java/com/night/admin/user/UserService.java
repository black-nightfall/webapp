package com.night.admin.user;

import com.night.admin.common.dto.ErrorCode;
import com.night.admin.common.exception.BusinessException;
import com.night.admin.user.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    /**
     * 获取用户信息
     */
    public UserDTO getUser(Long id) {
        log.info("Fetching user with id: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User not found with id: {}", id);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });
        
        log.debug("Found user: {}", user.getUsername());
        return convertToDTO(user);
    }
    
    /**
     * 获取所有用户
     */
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        log.debug("Found {} users", users.size());
        
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 转换 Entity 到 DTO
     */
    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
