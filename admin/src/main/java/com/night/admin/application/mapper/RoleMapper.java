package com.night.admin.application.mapper;

import com.night.admin.domain.role.entity.Role;
import com.night.admin.application.dto.response.RoleResponseDTO;
import com.night.admin.application.dto.request.CreateRoleRequestDTO;
import com.night.admin.application.dto.request.UpdateRoleRequestDTO;
import org.springframework.stereotype.Component;

/**
 * 角色映射器
 * 负责 DTO 和 Domain 实体之间的转换
 */
@Component
public class RoleMapper {

    public RoleResponseDTO toResponseDTO(Role role) {
        if (role == null) {
            return null;
        }
        return RoleResponseDTO.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .build();
    }

    /**
     * 将创建角色请求 DTO 转换为 Domain 实体
     */
    public Role toDomain(CreateRoleRequestDTO request) {
        if (request == null) {
            return null;
        }
        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        return role;
    }

    /**
     * 将更新角色请求 DTO 转换为 Domain 实体
     */
    public Role toDomain(UpdateRoleRequestDTO request) {
        if (request == null) {
            return null;
        }
        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        return role;
    }
}
