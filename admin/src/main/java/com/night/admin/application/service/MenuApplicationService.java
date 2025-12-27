package com.night.admin.application.service;

import com.night.admin.domain.menu.entity.Menu;
import com.night.admin.domain.menu.repository.MenuRepository;
import com.night.admin.application.dto.response.MenuResponseDTO;
import com.night.admin.application.mapper.MenuMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MenuApplicationService {

    private final MenuRepository menuRepository;
    private final MenuMapper menuMapper;

    /**
     * 获取所有菜单（平铺列表）
     * 
     * @return 菜单列表
     */
    @Transactional(readOnly = true)
    public List<MenuResponseDTO> getAllMenus() {
        log.info("查询所有菜单");
        List<Menu> menus = menuRepository.findAllByOrderBySortOrder();
        return menus.stream()
                .map(menuMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * 获取菜单树形结构
     * 
     * @return 树形结构的菜单列表（顶级菜单及其子菜单）
     */
    @Transactional(readOnly = true)
    public List<MenuResponseDTO> getMenuTree() {
        log.info("查询菜单树");

        // 查询所有菜单
        List<Menu> allMenus = menuRepository.findAllByOrderBySortOrder();

        // 转换为 DTO
        List<MenuResponseDTO> allMenuDTOs = allMenus.stream()
                .map(menuMapper::toResponseDTO)
                .collect(Collectors.toList());

        // 构建树形结构
        return buildMenuTree(allMenuDTOs);
    }

    /**
     * 构建菜单树
     * 
     * @param allMenus 所有菜单的扁平列表
     * @return 树形结构的菜单列表
     */
    private List<MenuResponseDTO> buildMenuTree(List<MenuResponseDTO> allMenus) {
        // 按 ID 分组，方便查找
        Map<Long, MenuResponseDTO> menuMap = allMenus.stream()
                .collect(Collectors.toMap(MenuResponseDTO::getId, menu -> menu));

        // 顶级菜单列表（parentId == 0）
        List<MenuResponseDTO> rootMenus = new ArrayList<>();

        for (MenuResponseDTO menu : allMenus) {
            if (menu.getParentId() == 0) {
                // 是顶级菜单
                rootMenus.add(menu);
            } else {
                // 是子菜单，找到父菜单并添加到其 children 中
                MenuResponseDTO parent = menuMap.get(menu.getParentId());
                if (parent != null) {
                    if (parent.getChildren() == null) {
                        parent.setChildren(new ArrayList<>());
                    }
                    parent.getChildren().add(menu);
                }
            }
        }

        return rootMenus;
    }
}
