-- sql
-- 插入初始角色数据
WITH r AS (
    INSERT INTO role_info (id, name, description)
    VALUES (0, 'super_admin', 'Super administrator with full privileges')
    RETURNING id
),
-- 插入初始用户数据
u AS (
    INSERT INTO user_info (uid,role_id, username, email, password_hash, full_name, is_active)
    VALUES (gen_random_uuid(), 0, 'superadmin', 'admin@example.com', '$2a$10$NtwkCVIX.hL.83rcqPzC5upknYykY69WEdbDAXCslOLipqqtxjXFq', 'Super Admin', true)
    RETURNING id
)

-- 插入初始产品数据
INSERT INTO products (name, description, price, stock, category, image_url, is_active)
VALUES 
    ('Laptop', 'High-performance laptop for work and gaming', 1200.00, 50, 'Electronics', 'https://example.com/laptop.jpg', true),
    ('Mouse', 'Wireless ergonomic mouse', 25.00, 200, 'Electronics', 'https://example.com/mouse.jpg', true),
    ('Keyboard', 'Mechanical keyboard with RGB lighting', 80.00, 100, 'Electronics', 'https://example.com/keyboard.jpg', true),
    ('Monitor', '27-inch 4K monitor', 350.00, 30, 'Electronics', 'https://example.com/monitor.jpg', true);

-- 插入初始订单数据
INSERT INTO orders (order_number, user_id, total_amount, status, shipping_address)
VALUES 
    ('ORD-001', 1, 1280.00, 'COMPLETED', '123 Main St, City, State 12345'),
    ('ORD-002', 1, 105.00, 'PENDING', '123 Main St, City, State 12345'),
    ('ORD-003', 1, 350.00, 'SHIPPED', '123 Main St, City, State 12345');