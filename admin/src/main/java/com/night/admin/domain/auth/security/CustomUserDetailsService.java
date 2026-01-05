package com.night.admin.domain.auth.security;

import com.night.admin.domain.menu.entity.Menu;
import com.night.admin.domain.role.entity.RoleMenu;
import com.night.admin.domain.role.repository.RoleMenuRepository;
import com.night.admin.domain.menu.repository.MenuRepository;
import com.night.admin.domain.user.repository.UserRepository;
import com.night.admin.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Spring Security UserDetailsService 实现
 * 加载用户信息和权限
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleMenuRepository roleMenuRepository;
    private final MenuRepository menuRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 查询用户
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // 2. 加载用户权限
        Set<String> permissions = loadUserPermissions(user);

        log.debug("Loaded user: {}, permissions: {}", username, permissions);

        // 3. 构建AdminUserDetails
        return new AdminUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getIsActive(),
                permissions);
    }

    /**
     * 加载用户权限
     * 通过用户的roleId查询role_menu关联，再查询menu获取perms权限标识
     */
    private Set<String> loadUserPermissions(User user) {
        // 如果用户没有角色，返回空权限
        if (user.getRoleId() == null) {
            log.warn("User {} has no role assigned", user.getUsername());
            return Collections.emptySet();
        }

        try {
            // 查询角色关联的菜单
            List<RoleMenu> roleMenus = roleMenuRepository.findByRoleId(user.getRoleId().intValue());

            if (roleMenus.isEmpty()) {
                log.warn("Role {} has no menus assigned", user.getRoleId());
                return Collections.emptySet();
            }

            // 提取菜单ID列表
            List<Long> menuIds = roleMenus.stream()
                    .map(rm -> rm.getMenuId())
                    .collect(Collectors.toList());

            // 查询菜单信息
            List<Menu> menus = menuRepository.findAllById(menuIds);

            // 提取权限标识（过滤空权限）
            Set<String> permissions = menus.stream()
                    .map(Menu::getPerms)
                    .filter(perms -> perms != null && !perms.isBlank())
                    .collect(Collectors.toSet());

            return permissions;
        } catch (Exception e) {
            log.error("Failed to load permissions for user: {}", user.getUsername(), e);
            return Collections.emptySet();
        }
    }
}
