package com.night.admin.application.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 分配角色权限请求 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignRolePermissionsRequestDTO {

    @NotNull(message = "菜单ID列表不能为空")
    private List<Long> menuIds;
}
