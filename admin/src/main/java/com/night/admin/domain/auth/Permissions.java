package com.night.admin.domain.auth;

/**
 * API权限常量定义
 * 命名规范: 模块:操作
 */
public final class Permissions {

    private Permissions() {
        // 工具类，禁止实例化
    }

    // ===== 用户管理权限 =====
    public static final String USER_READ = "user:read";
    public static final String USER_CREATE = "user:create";
    public static final String USER_UPDATE = "user:update";
    public static final String USER_DELETE = "user:delete";

    // ===== 角色管理权限 =====
    public static final String ROLE_READ = "role:read";
    public static final String ROLE_CREATE = "role:create";
    public static final String ROLE_UPDATE = "role:update";
    public static final String ROLE_DELETE = "role:delete";
    public static final String ROLE_PERMISSION = "role:permission"; // 分配权限

    // ===== 产品管理权限 =====
    public static final String PRODUCT_READ = "product:read";
    public static final String PRODUCT_CREATE = "product:create";
    public static final String PRODUCT_UPDATE = "product:update";
    public static final String PRODUCT_DELETE = "product:delete";

    // ===== 订单管理权限 =====
    public static final String ORDER_READ = "order:read";
    public static final String ORDER_CREATE = "order:create";
    public static final String ORDER_UPDATE = "order:update";
    public static final String ORDER_DELETE = "order:delete";

    // ===== 菜单管理权限 =====
    public static final String MENU_READ = "menu:read";
    public static final String MENU_CREATE = "menu:create";
    public static final String MENU_UPDATE = "menu:update";
    public static final String MENU_DELETE = "menu:delete";

    // ===== 会话管理权限 =====
    public static final String SESSION_READ = "session:read";
    public static final String SESSION_KICK = "session:kick"; // 踢出用户
}
