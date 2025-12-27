package com.night.admin.domain.role.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 角色菜单关联表的复合主键
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleMenuId implements Serializable {

    private Integer roleId;
    private Long menuId;
}
