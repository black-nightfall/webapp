-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Insert default admin user (password: admin123, BCrypt encoded)
INSERT INTO users (username, password, email, enabled) 
VALUES ('admin', '$2a$10$rN7qGvXQH8X8kDKK7Q6X2.qPF3YZQ7qVx0J7X8ZQ7qVx0J7X8ZQ7q', 'admin@example.com', true)
ON CONFLICT (username) DO NOTHING;

COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.id IS '用户ID';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users.password IS 'BCrypt加密的密码';
COMMENT ON COLUMN users.email IS '邮箱';
COMMENT ON COLUMN users.enabled IS '是否启用';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';
