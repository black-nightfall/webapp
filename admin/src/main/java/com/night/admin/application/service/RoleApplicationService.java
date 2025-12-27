package com.night.admin.application.service;

import com.night.admin.domain.role.RoleService;
import com.night.admin.domain.role.entity.Role;
import com.night.admin.domain.role.entity.RoleMenu;
import com.night.admin.domain.role.repository.RoleRepository;
import com.night.admin.domain.role.repository.RoleMenuRepository;
import com.night.admin.domain.role.specification.RoleSpecification;
import com.night.admin.domain.menu.entity.Menu;
import com.night.admin.domain.menu.repository.MenuRepository;
import com.night.admin.application.dto.response.RoleResponseDTO;
import com.night.admin.application.dto.response.MenuResponseDTO;
import com.night.admin.application.dto.request.CreateRoleRequestDTO;
import com.night.admin.application.dto.request.UpdateRoleRequestDTO;
import com.night.admin.application.dto.request.SearchRoleRequestDTO;
import com.night.admin.application.dto.request.AssignRolePermissionsRequestDTO;
import com.night.admin.application.mapper.RoleMapper;
import com.night.admin.application.mapper.MenuMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleApplicationService {

    private final RoleService roleService;
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    private final RoleMenuRepository roleMenuRepository;
    private final MenuRepository menuRepository;
    private final MenuMapper menuMapper;

    @Transactional(readOnly = true)
    public RoleResponseDTO getRoleById(Integer id) {
        Role role = roleService.getRoleById(id);
        return roleMapper.toResponseDTO(role);
    }

    @Transactional
    public RoleResponseDTO createRole(CreateRoleRequestDTO request) {
        log.info("创建角色: name={}", request.getName());
        Role role = roleMapper.toDomain(request);
        Role savedRole = roleService.save(role);
        return roleMapper.toResponseDTO(savedRole);
    }

    /**
     * 更新角色
     * 
     * @param id      角色ID
     * @param request 更新请求（所有字段均为可选）
     * @return 更新后的角色响应DTO
     */
    @Transactional
    public RoleResponseDTO updateRole(Integer id, UpdateRoleRequestDTO request) {
        log.info("更新角色: roleId={}, request={}", id, request);

        // 将 DTO 转换为 Domain 对象
        Role updateData = roleMapper.toDomain(request);

        // 调用领域服务执行更新逻辑
        Role updatedRole = roleService.updateRole(id, updateData);

        // 转换为 ResponseDTO 返回
        return roleMapper.toResponseDTO(updatedRole);
    }

    /**
     * 删除角色
     * 
     * @param id 角色ID
     */
    @Transactional
    public void deleteRole(Integer id) {
        log.info("删除角色: roleId={}", id);
        roleService.deleteRole(id);
        log.info("角色删除成功: roleId={}", id);
    }

    /**
     * 搜索角色（支持可选条件）
     * 
     * @param request  搜索条件（所有字段均为可选）
     * @param pageable 分页参数
     * @return 分页角色列表
     */
    @Transactional(readOnly = true)
    public Page<RoleResponseDTO> searchRoles(SearchRoleRequestDTO request, Pageable pageable) {
        log.info("搜索角色: name={}", request.getName());

        // 使用 Specification 构建动态查询条件
        Specification<Role> spec = RoleSpecification.buildSearchCriteria(
                request.getName());

        // 执行分页查询
        Page<Role> roles = roleRepository.findAll(spec, pageable);

        // 转换为 ResponseDTO
        return roles.map(roleMapper::toResponseDTO);
    }

    /**
     * 搜索角色（不分页，返回所有匹配结果）
     * 
     * @param request 搜索条件
     * @return 角色列表
     */
    @Transactional(readOnly = true)
    public List<RoleResponseDTO> searchRoles(SearchRoleRequestDTO request) {
        log.info("搜索角色（不分页）: name={}", request.getName());

        Specification<Role> spec = RoleSpecification.buildSearchCriteria(
                request.getName());

        List<Role> roles = roleRepository.findAll(spec);

        return roles.stream()
                .map(roleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * 分配角色权限
     * 
     * @param roleId  角色ID
     * @param request 权限分配请求
     */
    @Transactional
    public void assignPermissions(Integer roleId, AssignRolePermissionsRequestDTO request) {
        log.info("分配角色权限: roleId={}, menuIds={}", roleId, request.getMenuIds());

        // 验证角色是否存在
        roleService.getRoleById(roleId);

        // 删除该角色原有的所有权限
        roleMenuRepository.deleteByRoleId(roleId);

        // 批量插入新的权限关联
        List<RoleMenu> roleMenus = request.getMenuIds().stream()
                .map(menuId -> RoleMenu.builder()
                        .roleId(roleId)
                        .menuId(menuId)
                        .build())
                .collect(Collectors.toList());

        roleMenuRepository.saveAll(roleMenus);

        log.info("角色权限分配成功: roleId={}, 权限数量={}", roleId, roleMenus.size());
    }

    /**
     * 获取角色的权限列表
     * 
     * @param roleId 角色ID
     * @return 菜单权限列表
     */
    @Transactional(readOnly = true)
    public List<MenuResponseDTO> getRolePermissions(Integer roleId) {
        log.info("查询角色权限: roleId={}", roleId);

        // 验证角色是否存在
        roleService.getRoleById(roleId);

        // 查询角色关联的菜单ID列表
        List<RoleMenu> roleMenus = roleMenuRepository.findByRoleId(roleId);
        List<Long> menuIds = roleMenus.stream()
                .map(RoleMenu::getMenuId)
                .collect(Collectors.toList());

        if (menuIds.isEmpty()) {
            return List.of();
        }

        // 查询菜单详情
        List<Menu> menus = menuRepository.findAllById(menuIds);

        return menus.stream()
                .map(menuMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
