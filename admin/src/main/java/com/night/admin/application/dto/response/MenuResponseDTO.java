package com.night.admin.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 菜单响应 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponseDTO {
    private Long id;
    private Long parentId;
    private String title;
    private String name;
    private String path;
    private String component;
    private String perms;
    private String icon;
    private Integer sortOrder;
    private String menuType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * 子菜单列表（用于树形结构）
     */
    private List<MenuResponseDTO> children;
}
