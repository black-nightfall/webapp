# Admin 项目完整部署和使用指南

## 📋 目录
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [数据库准备](#数据库准备)
- [后端启动](#后端启动)
- [前端启动](#前端启动)
- [API 使用说明](#api-使用说明)
- [会话管理](#会话管理)
- [常见问题](#常见问题)

---

## 🛠 技术栈

### 后端
- **框架**: Spring Boot 3.x
- **数据库**: PostgreSQL 15
- **ORM**: Spring Data JPA + Hibernate
- **缓存**: Redis 7
- **安全**: Spring Security + JWT
- **数据库迁移**: Flyway
- **密码加密**: BCrypt

### 前端
- **框架**: React 18 + TypeScript
- **构建**: Vite 7
- **UI**: Ant Design 6
- **状态**: Context API
- **HTTP**: Axios

---

## 🚀 快速开始

### 1. 环境要求

- **Java**: 17+
- **Node.js**: 18+
- **Docker & Docker Compose**: 最新版本

### 2. 启动基础设施（PostgreSQL + Redis）

```bash
cd infra/docker
docker-compose up -d
```

验证服务状态：
```bash
docker-compose ps
```

你应该看到：
- ✅ `project_postgres` - 健康运行
- ✅ `project_redis` - 健康运行
- ✅ `project_flyway` - 已完成迁移

---

## 📊 数据库准备

### 数据库连接信息

```yaml
数据库: appdb
用户名: appuser
密码: changeme
端口: 5432
```

### 默认管理员账户

Flyway 迁移会自动创建默认管理员：

```
用户名: admin
密码: admin123
```

### 验证数据库

```bash
# 连接到 PostgreSQL
docker exec -it project_postgres psql -U appuser -d appdb

# 查看用户表
\dt
SELECT * FROM users;
```

你应该看到一个用户记录（admin）。

---

## 🖥 后端启动

### 方式一：使用 Gradle（开发环境）

```bash
cd admin
../gradlew bootRun
```

### 方式二：构建 JAR 运行

```bash
cd admin
../gradlew build
java -jar build/libs/admin-0.0.1-SNAPSHOT.jar
```

### 验证后端启动

访问：`http://localhost:9090/admin/api/auth/login`

如果返回 405 Method Not Allowed，说明后端已正常启动。

### 查看日志

日志级别配置在 `application.yaml`:
```yaml
logging:
  level:
    com.night.admin: DEBUG
```

---

## 🎨 前端启动

### 安装依赖

```bash
cd admin/frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问：`http://localhost:5173`

### 生产构建

```bash
npm run build
```

输出目录：`dist/`

---

## 📡 API 使用说明

### Base URL

- **开发环境**: `http://localhost:9090/admin`
- **生产环境**: 根据部署配置

### 认证流程

#### 1. 登录获取 Token

**请求**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "admin"
  },
  "timestamp": 1735059720000
}
```

#### 2. 使用 Token 访问受保护的端点

所有 `/api/*` 端点（除了 `/api/auth/*`）都需要认证。

**请求示例**:
```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### 3. 登出

**请求**:
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**响应**:
```json
{
  "code": 200,
  "message": "Success",
  "data": null,
  "timestamp": 1735059720000
}
```

---

## 🔐 会话管理

### Token 存储机制

- **JWT**: 存储在客户端（localStorage）
- **Redis**: 服务端存储 Token 会话，支持强制下线

### 多设备登录

同一用户可以同时在多个设备登录，每个设备持有不同的 Token。

### 管理员踢用户下线

#### 查看用户会话信息

**请求**:
```http
GET /api/sessions/{username}
Authorization: Bearer {admin_token}
```

**响应**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "username": "admin",
    "activeTokenCount": 3
  },
  "timestamp": 1735059720000
}
```

#### 踢用户下线（删除所有会话）

**请求**:
```http
DELETE /api/sessions/{username}
Authorization: Bearer {admin_token}
```

**响应**:
```json
{
  "code": 200,
  "message": "用户已被踢下线",
  "data": null,
  "timestamp": 1735059720000
}
```

**效果**: 该用户的所有 Token 立即失效，需要重新登录。

---

## 📚 完整 API 列表

### 认证相关

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|----------|
| POST | `/api/auth/login` | 用户登录 | ❌ |
| POST | `/api/auth/logout` | 用户登出 | ✅ |

### 会话管理

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|----------|
| GET | `/api/sessions/{username}` | 获取用户会话信息 | ✅ |
| DELETE | `/api/sessions/{username}` | 踢用户下线 | ✅ |

### 用户管理

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|----------|
| GET | `/api/users` | 获取所有用户 | ✅ |
| GET | `/api/users/{id}` | 获取单个用户 | ✅ |

### 产品管理

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|----------|
| GET | `/api/products` | 获取所有产品 | ✅ |
| GET | `/api/products/{id}` | 获取单个产品 | ✅ |

### 订单管理

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|----------|
| POST | `/api/orders` | 创建订单 | ✅ |

---

## 🧪 测试流程

### 1. 测试登录

```bash
curl -X POST http://localhost:9090/admin/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. 保存 Token

从响应中复制 `data.token` 的值。

### 3. 测试受保护的端点

```bash
TOKEN="你的token"
curl -X GET http://localhost:9090/admin/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### 4. 测试踢用户下线

```bash
curl -X DELETE http://localhost:9090/admin/api/sessions/admin \
  -H "Authorization: Bearer $TOKEN"
```

再次使用之前的 Token 访问，应该返回 401 未授权。

---

## 🔧 配置说明

### 后端配置 (application.yaml)

```yaml
# 数据库配置
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/appdb
    username: appuser
    password: changeme

# Redis 配置
  data:
    redis:
      host: localhost
      port: 6379
      password: changeme

# JWT 配置
jwt:
  secret: your-very-long-secret-key...
  expiration: 86400000  # 24小时
```

### 前端配置

**开发环境** (`.env.development`):
```env
VITE_API_BASE_URL=/api
```

**生产环境** (`.env.production`):
```env
VITE_API_BASE_URL=/admin
```

---

## ❓ 常见问题

### 1. 后端启动失败：无法连接数据库

**问题**: 
```
Connection refused: localhost:5432
```

**解决方案**:
```bash
# 确认 Docker 容器运行
docker-compose ps

# 重启数据库
docker-compose restart db
```

### 2. Redis 连接失败

**问题**:
```
Unable to connect to Redis
```

**解决方案**:
```bash
# 检查 Redis 容器
docker-compose ps redis

# 测试 Redis 连接
docker exec -it project_redis redis-cli -a changeme ping
```

应该返回 `PONG`。

### 3. Flyway 迁移失败

**问题**: 数据库表未创建

**解决方案**:
```bash
# 手动运行 Flyway 迁移
docker-compose up flyway

# 或重置数据库
docker-compose down -v
docker-compose up -d
```

### 4. 登录返回 401 Unauthorized

**可能原因**:
1. 用户名密码错误
2. 用户被禁用（`enabled = false`）
3. 数据库中没有用户数据

**解决方案**:
```sql
-- 检查用户数据
SELECT * FROM users WHERE username = 'admin';

-- 如果没有，手动插入（密码: admin123）
INSERT INTO users (username, password, email, enabled) 
VALUES ('admin', '$2a$10$rN7qGvXQH8X8kDKK7Q6X2.qPF3YZQ7qVx0J7X8ZQ7qVx0J7X8ZQ7q', 'admin@example.com', true);
```

### 5. Token 失效太快

**原因**: Token 默认 24 小时过期

**修改过期时间**:
```yaml
# application.yaml
jwt:
  expiration: 604800000  # 7天 (毫秒)
```

### 6. 前端代理不生效

**问题**: API 请求 404

**解决方案**:
1. 确认 Vite 开发服务器正在运行
2. 检查 `vite.config.ts` 代理配置
3. 重启前端服务器

---

## 📦 生产部署

### 使用 Docker 部署

**Dockerfile** (backend):
```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY build/libs/admin-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Dockerfile** (frontend):
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 环境变量

生产环境建议使用环境变量：

```bash
export DB_URL=jdbc:postgresql://prod-db:5432/appdb
export DB_USERNAME=produser
export DB_PASSWORD=strong_password
export REDIS_HOST=prod-redis
export REDIS_PASSWORD=strong_redis_password
export JWT_SECRET=your-very-strong-production-secret-key
```

---

## 📝 下一步改进

1. ✅ 添加用户角色和权限管理
2. ✅ 实现 Token 刷新机制
3. ✅ 添加登录日志记录
4. ✅ 实现 API 限流
5. ✅ 添加 Swagger/OpenAPI 文档

---

**最后更新**: 2025-12-25  
**维护者**: 开发团队
