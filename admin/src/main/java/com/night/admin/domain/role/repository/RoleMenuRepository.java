package com.night.admin.domain.role.repository;

import com.night.admin.domain.role.entity.RoleMenu;
import com.night.admin.domain.role.entity.RoleMenuId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleMenuRepository extends JpaRepository<RoleMenu, RoleMenuId> {

    /**
     * 根据角色ID查询所有关联的菜单
     */
    List<RoleMenu> findByRoleId(Integer roleId);

    /**
     * 删除指定角色的所有权限关联
     */
    void deleteByRoleId(Integer roleId);
}
