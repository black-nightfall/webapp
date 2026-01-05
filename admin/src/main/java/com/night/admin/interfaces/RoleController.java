package com.night.admin.interfaces;

import com.night.admin.application.service.RoleApplicationService;
import com.night.admin.application.dto.request.CreateRoleRequestDTO;
import com.night.admin.application.dto.request.UpdateRoleRequestDTO;
import com.night.admin.application.dto.request.SearchRoleRequestDTO;
import com.night.admin.application.dto.request.AssignRolePermissionsRequestDTO;
import com.night.admin.application.dto.response.RoleResponseDTO;
import com.night.admin.application.dto.response.MenuResponseDTO;
import com.night.admin.domain.auth.Permissions;
import com.night.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@Slf4j
public class RoleController {

    private final RoleApplicationService roleApplicationService;

    /**
     * 获取角色详情
     * GET /api/roles/{id}
     */
    @PreAuthorize("hasAuthority('" + Permissions.ROLE_READ + "')")
    @GetMapping("/{id}")
    public ApiResponse<RoleResponseDTO> getRole(@PathVariable Integer id) {
        try {
            RoleResponseDTO role = roleApplicationService.getRoleById(id);
            return ApiResponse.success(role, "角色查询成功");
        } catch (Exception e) {
            log.error("获取角色失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.NOT_FOUND, "角色不存在");
        }
    }

    /**
     * 创建角色
     * POST /api/roles
     */
    @PreAuthorize("hasAuthority('" + Permissions.ROLE_CREATE + "')")
    @PostMapping
    public ApiResponse<RoleResponseDTO> createRole(@Valid @RequestBody CreateRoleRequestDTO request) {
        try {
            RoleResponseDTO role = roleApplicationService.createRole(request);
            return ApiResponse.success(role, "角色创建成功");
        } catch (IllegalArgumentException e) {
            log.error("创建角色失败: {}", e.getMessage());
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            log.error("创建角色失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "创建角色失败: " + e.getMessage());
        }
    }

    /**
     * 更新角色
     * PUT /api/roles/{id}
     * 
     * @param id      角色ID
     * @param request 更新请求（所有字段均为可选）
     * @return 更新后的角色信息
     */
    @PreAuthorize("hasAuthority('" + Permissions.ROLE_UPDATE + "')")
    @PutMapping("/{id}")
    public ApiResponse<RoleResponseDTO> updateRole(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateRoleRequestDTO request) {
        try {
            RoleResponseDTO role = roleApplicationService.updateRole(id, request);
            return ApiResponse.success(role, "角色更新成功");
        } catch (IllegalArgumentException e) {
            log.error("更新角色失败: {}", e.getMessage());
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            log.error("更新角色失败: roleId={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "更新角色失败: " + e.getMessage());
        }
    }

    /**
     * 删除角色
     * DELETE /api/roles/{id}
     * 
     * @param id 角色ID
     * @return 删除结果
     */
    @PreAuthorize("hasAuthority('" + Permissions.ROLE_DELETE + "')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable Integer id) {
        try {
            roleApplicationService.deleteRole(id);
            return ApiResponse.success(null, "角色删除成功");
        } catch (Exception e) {
            log.error("删除角色失败: roleId={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "删除角色失败: " + e.getMessage());
        }
    }

    /**
     * 搜索角色（支持可选条件和分页）
     * GET
     * /api/roles/search?name=xxx&page=0&size=10&sortBy=createdAt&sortDirection=desc
     * 
     * @param request 搜索条件（包含业务查询条件和分页参数）
     * @return 分页角色列表
     */
    @PreAuthorize("hasAuthority('" + Permissions.ROLE_READ + "')")
    @GetMapping("/search")
    public ApiResponse<Page<RoleResponseDTO>> searchRoles(
            @ModelAttribute SearchRoleRequestDTO request) {
        try {
            // 通过继承的 toPageable() 方法转换为 Pageable
            Pageable pageable = request.toPageable();

            // 执行查询
            Page<RoleResponseDTO> roles = roleApplicationService.searchRoles(request, pageable);

            log.info("搜索角色成功: 查询条件={}, 结果数={}, 总数={}",
                    request, roles.getNumberOfElements(), roles.getTotalElements());

            return ApiResponse.success(roles, "查询成功");
        } catch (Exception e) {
            log.error("搜索角色失败: request={}, error={}",
                    request, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "搜索失败");
        }
    }

    /**
     * 分配角色权限
     * PUT /api/roles/{id}/permissions
     * 
     * @param id      角色ID
     * @param request 权限分配请求
     * @return 操作结果
     */
    @PreAuthorize("hasAuthority('" + Permissions.ROLE_PERMISSION + "')")
    @PutMapping("/{id}/permissions")
    public ApiResponse<Void> assignPermissions(
            @PathVariable Integer id,
            @Valid @RequestBody AssignRolePermissionsRequestDTO request) {
        try {
            roleApplicationService.assignPermissions(id, request);
            return ApiResponse.success(null, "权限分配成功");
        } catch (Exception e) {
            log.error("分配权限失败: roleId={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "分配权限失败: " + e.getMessage());
        }
    }

    /**
     * 获取角色的权限列表
     * GET /api/roles/{id}/permissions
     * 
     * @param id 角色ID
     * @return 菜单权限列表
     */
    @PreAuthorize("hasAuthority('" + Permissions.ROLE_READ + "')")
    @GetMapping("/{id}/permissions")
    public ApiResponse<List<MenuResponseDTO>> getRolePermissions(@PathVariable Integer id) {
        try {
            List<MenuResponseDTO> permissions = roleApplicationService.getRolePermissions(id);
            return ApiResponse.success(permissions, "查询成功");
        } catch (Exception e) {
            log.error("获取角色权限失败: roleId={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "查询失败");
        }
    }
}
