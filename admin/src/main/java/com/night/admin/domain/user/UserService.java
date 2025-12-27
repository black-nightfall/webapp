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

    public User updateUser(Long id, User updatedData) {
        log.info("Updating user with id: {}", id);

        User existingUser = getUserById(id);

        // 更新非空字段
        if (updatedData.getUsername() != null) {
            // 检查用户名是否已被其他用户使用
            if (userRepository.existsByUsername(updatedData.getUsername())
                    && !existingUser.getUsername().equals(updatedData.getUsername())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "用户名已存在");
            }
            existingUser.setUsername(updatedData.getUsername());
        }

        if (updatedData.getEmail() != null) {
            // 检查邮箱是否已被其他用户使用
            if (userRepository.existsByEmail(updatedData.getEmail())
                    && !existingUser.getEmail().equals(updatedData.getEmail())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "邮箱已存在");
            }
            existingUser.setEmail(updatedData.getEmail());
        }

        if (updatedData.getPassword() != null) {
            existingUser.setPassword(updatedData.getPassword());
        }

        if (updatedData.getFullName() != null) {
            existingUser.setFullName(updatedData.getFullName());
        }

        if (updatedData.getIsActive() != null) {
            existingUser.setIsActive(updatedData.getIsActive());
        }

        if (updatedData.getRoleId() != null) {
            existingUser.setRoleId(updatedData.getRoleId());
        }

        User savedUser = userRepository.save(existingUser);
        log.info("User updated successfully: {}", savedUser.getId());
        return savedUser;
    }

    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);

        User user = getUserById(id);
        userRepository.delete(user);

        log.info("User deleted successfully: {}", id);
    }
}
