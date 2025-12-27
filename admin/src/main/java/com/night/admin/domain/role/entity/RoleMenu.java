package com.night.admin.domain.role.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 角色菜单关联实体
 * 映射 role_menu 表
 */
@Entity
@Table(name = "role_menu")
@IdClass(RoleMenuId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleMenu {

    @Id
    @Column(name = "role_id")
    private Integer roleId;

    @Id
    @Column(name = "menu_id")
    private Long menuId;
}
