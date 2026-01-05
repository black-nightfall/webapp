-- sql
-- 插入初始角色数
-- 2. 创建管理员角色(如果不存在)
INSERT INTO role_info (id, name, description)
VALUES (0,'ADMIN', '系统管理员，拥有所有权限')
    ON CONFLICT DO NOTHING;
-- 插入初始用户数据
with u AS (
INSERT INTO user_info (uid,role_id, username, email, password_hash, full_name, is_active)
VALUES (gen_random_uuid(), 0, 'admin', 'admin@example.com', '$2a$10$NtwkCVIX.hL.83rcqPzC5upknYykY69WEdbDAXCslOLipqqtxjXFq', 'Super Admin', true)
    RETURNING id
    )


-- 初始化权限菜单数据和管理员角色

-- 1. 插入权限菜单项（Menu表）
-- 用户管理权限
INSERT INTO menu_info (parent_id, title, name, path, perms, menu_type, sort_order)
VALUES
-- 用户管理模块
    (0, '用户管理', 'user', '/users', NULL, 'M', 1),
    (1, '查看用户', 'user:read', NULL, 'user:read', 'F', 1),
    (1, '创建用户', 'user:create', NULL, 'user:create', 'F', 2),
    (1, '更新用户', 'user:update', NULL, 'user:update', 'F', 3),
    (1, '删除用户', 'user:delete', NULL, 'user:delete', 'F', 4),

-- 角色管理模块
    (0, '角色管理', 'role', '/roles', NULL, 'M', 2),
    (6, '查看角色', 'role:read', NULL, 'role:read', 'F', 1),
    (6, '创建角色', 'role:create', NULL, 'role:create', 'F', 2),
    (6, '更新角色', 'role:update', NULL, 'role:update', 'F', 3),
    (6, '删除角色', 'role:delete', NULL, 'role:delete', 'F', 4),
    (6, '分配权限', 'role:permission', NULL, 'role:permission', 'F', 5),

-- 菜单管理模块
    (0, '菜单管理', 'menu', '/menus', NULL, 'M', 5),
    (22, '查看菜单', 'menu:read', NULL, 'menu:read', 'F', 1),
    (22, '创建菜单', 'menu:create', NULL, 'menu:create', 'F', 2),
    (22, '更新菜单', 'menu:update', NULL, 'menu:update', 'F', 3),
    (22, '删除菜单', 'menu:delete', NULL, 'menu:delete', 'F', 4),

-- 会话管理模块
    (0, '会话管理', 'session', '/sessions', NULL, 'M', 6),
    (27, '查看会话', 'session:read', NULL, 'session:read', 'F', 1),
    (27, '踢出用户', 'session:kick', NULL, 'session:kick', 'F', 2);



-- 3. 为管理员角色分配所有权限
-- 获取管理员角色ID和所有权限菜单ID，建立关联
INSERT INTO role_menu (role_id, menu_id)
SELECT r.id, m.id
FROM role_info r, menu_info m
WHERE r.name = 'ADMIN'
  AND m.perms IS NOT NULL
  AND m.menu_type = 'F'
    ON CONFLICT DO NOTHING;

-- 4. 更新superadmin用户的roleId为ADMIN角色
UPDATE user_info
SET role_id = (SELECT id FROM role_info WHERE name = 'ADMIN' LIMIT 1)
WHERE username = 'superadmin';

-- 5. 添加测试用户：普通用户（只有读权限）
-- 首先创建普通用户角色
INSERT INTO role_info (name, description)
VALUES ('USER', '普通用户，只有查看权限')
    ON CONFLICT DO NOTHING;

-- 为普通用户角色分配读权限
INSERT INTO role_menu (role_id, menu_id)
SELECT r.id, m.id
FROM role_info r, menu_info m
WHERE r.name = 'USER'
  AND m.perms IN ('user:read', 'role:read', 'product:read', 'order:read', 'menu:read', 'session:read')
  AND m.menu_type = 'F'
    ON CONFLICT DO NOTHING;

-- 创建普通测试用户 (密码: user123)
INSERT INTO user_info (uid, role_id, username, email, password_hash, full_name, is_active)
VALUES (
           gen_random_uuid(),
           (SELECT id FROM role_info WHERE name = 'USER' LIMIT 1),
    'testuser',
    'user@example.com',
    '$2a$10$NtwkCVIX.hL.83rcqPzC5upknYykY69WEdbDAXCslOLipqqtxjXFq', -- 密码: user123
    'Test User',
    true
    )
ON CONFLICT DO NOTHING;
