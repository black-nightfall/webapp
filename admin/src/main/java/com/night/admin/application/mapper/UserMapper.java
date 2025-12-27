package com.night.admin.application.mapper;

import com.night.admin.domain.user.entity.User;
import com.night.admin.application.dto.response.UserResponseDTO;
import com.night.admin.application.dto.request.CreateUserRequestDTO;
import com.night.admin.application.dto.request.UpdateUserRequestDTO;
import com.night.admin.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * 用户映射器
 * 负责 DTO 和 Domain 实体之间的转换
 */
@Component
@RequiredArgsConstructor
public class UserMapper {

    private final PasswordUtil passwordUtil;

    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserResponseDTO.builder()
                .id(user.getId())
                .uid(user.getUid())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .isActive(user.getIsActive())
                .roleId(user.getRoleId())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * 将创建用户请求 DTO 转换为 Domain 实体
     * 自动加密密码
     */
    public User toDomain(CreateUserRequestDTO request) {
        if (request == null) {
            return null;
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // 加密密码
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordUtil.encodePassword(request.getPassword()));
        }

        return user;
    }

    /**
     * 将更新用户请求 DTO 转换为 Domain 实体
     * 如果提供了密码，则自动加密
     */
    public User toDomain(UpdateUserRequestDTO request) {
        if (request == null) {
            return null;
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // 只有提供了新密码时才加密
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordUtil.encodePassword(request.getPassword()));
        }

        user.setFullName(request.getFullName());
        user.setIsActive(request.getIsActive());
        user.setRoleId(request.getRoleId());
        return user;
    }
}