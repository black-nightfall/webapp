package com.night.admin.application.mapper;

import com.night.admin.domain.menu.entity.Menu;
import com.night.admin.application.dto.response.MenuResponseDTO;
import org.springframework.stereotype.Component;

/**
 * 菜单映射器
 * 负责 Menu 实体和 DTO 之间的转换
 */
@Component
public class MenuMapper {

    public MenuResponseDTO toResponseDTO(Menu menu) {
        if (menu == null) {
            return null;
        }
        return MenuResponseDTO.builder()
                .id(menu.getId())
                .parentId(menu.getParentId())
                .title(menu.getTitle())
                .name(menu.getName())
                .path(menu.getPath())
                .component(menu.getComponent())
                .perms(menu.getPerms())
                .icon(menu.getIcon())
                .sortOrder(menu.getSortOrder())
                .menuType(menu.getMenuType())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
