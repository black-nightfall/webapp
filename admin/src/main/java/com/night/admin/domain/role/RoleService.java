package com.night.admin.domain.role;

import com.night.admin.domain.role.entity.Role;
import com.night.admin.domain.role.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 角色领域服务
 * 处理角色相关的核心业务逻辑
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    /**
     * 根据ID获取角色
     *
     * @param id 角色ID
     * @return Role
     * @throws RuntimeException 角色不存在时抛出异常
     */
    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("角色不存在: id=" + id));
    }

    /**
     * 保存角色（创建或更新）
     * 
     * @param role 角色实体
     * @return 保存后的角色
     */
    public Role save(Role role) {
        // 业务规则：角色名唯一性校验
        if (role.getId() == null && roleRepository.existsByName(role.getName())) {
            throw new IllegalArgumentException("角色名已存在: " + role.getName());
        }

        return roleRepository.save(role);
    }

    /**
     * 更新角色
     *
     * @param id         角色ID
     * @param updateData 更新数据
     * @return 更新后的角色
     */
    public Role updateRole(Integer id, Role updateData) {
        Role existingRole = getRoleById(id);

        // 如果要更新角色名，检查唯一性
        if (updateData.getName() != null
                && !updateData.getName().equals(existingRole.getName())
                && roleRepository.existsByName(updateData.getName())) {
            throw new IllegalArgumentException("角色名已存在: " + updateData.getName());
        }

        // 更新字段（只更新非空字段）
        if (updateData.getName() != null) {
            existingRole.setName(updateData.getName());
        }
        if (updateData.getDescription() != null) {
            existingRole.setDescription(updateData.getDescription());
        }

        return roleRepository.save(existingRole);
    }

    /**
     * 删除角色
     *
     * @param id 角色ID
     */
    public void deleteRole(Integer id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
        log.info("角色已删除: id={}, name={}", id, role.getName());
    }
}
