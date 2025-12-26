package com.night.admin.domain.user;

import com.night.admin.domain.user.repository.UserRepository;
import com.night.admin.domain.user.entity.User;
import com.night.admin.exception.BusinessException;
import com.night.common.dto.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getUserById(Long id) {
        log.info("Fetching user with id: {}", id);
        
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User not found with id: {}", id);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });
    }
    
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        log.debug("Found {} users", users.size());
        return users;
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
