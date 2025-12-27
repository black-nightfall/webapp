package com.night.admin.interfaces;

import com.night.admin.application.service.MenuApplicationService;
import com.night.admin.application.dto.response.MenuResponseDTO;
import com.night.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
@Slf4j
public class MenuController {

    private final MenuApplicationService menuApplicationService;

    /**
     * 获取所有菜单（平铺列表）
     * GET /api/menus
     */
    @GetMapping
    public ApiResponse<List<MenuResponseDTO>> getAllMenus() {
        try {
            List<MenuResponseDTO> menus = menuApplicationService.getAllMenus();
            return ApiResponse.success(menus, "查询成功");
        } catch (Exception e) {
            log.error("获取菜单列表失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "查询失败");
        }
    }

    /**
     * 获取菜单树形结构
     * GET /api/menus/tree
     */
    @GetMapping("/tree")
    public ApiResponse<List<MenuResponseDTO>> getMenuTree() {
        try {
            List<MenuResponseDTO> menuTree = menuApplicationService.getMenuTree();
            return ApiResponse.success(menuTree, "查询成功");
        } catch (Exception e) {
            log.error("获取菜单树失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "查询失败");
        }
    }
}
