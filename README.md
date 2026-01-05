# 🐾 WebApp Project

一个现代化的全栈项目，包含管理后台（Admin）和用户前端（Website）。

## 📁 项目结构

```
webapp/
├── admin/              # 管理后台模块 (Spring Boot + JPA)
│   ├── src/           # Java 源代码
│   └── README.md      # Admin 模块文档
│
├── website/           # 用户网站模块
│   ├── frontend/      # Next.js 前端
│   │   ├── WORKFLOW_CN.md      # 前端开发工作流
│   │   ├── DEVELOPMENT_CN.md   # 前端技术文档
│   │   └── README.md           # 前端快速开始
│   └── src/           # Kotlin + WebFlux 后端
│
├── common/            # 通用模块
│   └── src/           # 共享代码和工具类
│
├── infra/             # 基础设施
│   ├── docker/        # Docker Compose 配置
│   │   ├── start-dev.sh    # 启动开发环境
│   │   ├── start-test.sh   # 启动测试环境
│   │   └── README.md       # Docker 环境文档
│   └── db/migration/  # Flyway 数据库迁移脚本
│
└── QUICKSTART.md      # 快速开始指南（你应该先读这个！）
```

## 🚀 快速开始

**新人必读**: 请先阅读 [QUICKSTART.md](./QUICKSTART.md)

```bash
# 1. 确保Docker Desktop运行中
docker ps

# 2A. 启动 Admin 后端（自动启动PostgreSQL + Redis）
./gradlew :admin:bootRun
# API: http://localhost:9090/admin/auth/login
# 默认账户: superadmin / admin123

# 2B. 启动 Admin 前端
cd admin/frontend
npm install
npm run dev -- --mode mock  # Mock模式
# 或
npm run dev                 # 连接后端
# 访问: http://localhost:5174

# 3A. 启动 Website 后端（复用相同数据库）
./gradlew :website:bootRun
# API: http://localhost:8080/news

# 3B. 启动 Website 前端
cd website/frontend
npm install
npm run dev
# 访问端口见控制台输出
```

## 📚 模块说明

### Admin 模块

**技术栈**: Spring Boot 4.0 + Java 21 + JPA + PostgreSQL + Redis

**用途**: 管理后台，提供用户、产品、订单等的 CRUD 管理功能。

**特性**:
- Spring Security + JWT 认证
- Redis 会话管理（支持多设备登录和踢出）
- Flyway 数据库版本管理
- PostgreSQL 数据持久化

**端口**: `9090`  
**上下文路径**: `/admin`

**API路径示例**:
- 登录: `POST /admin/auth/login`
- 用户管理: `/admin/users`, `/admin/users/{id}`
- 角色管理: `/admin/roles`, `/admin/roles/{id}`
- 菜单管理: `/admin/menus`
- 会话管理: `/admin/sessions/{username}`

**Postman Collection**: `admin/src/main/resources/postman/Admin-Backend-API.postman_collection.json`

### Website 模块

#### Backend (后端)

**技术栈**: Kotlin + Spring WebFlux + R2DBC + Coroutines

**用途**: 为前端提供 Reactive RESTful API。

**特性**:
- 完全异步非阻塞（Reactive）
- Kotlin Coroutines 支持
- R2DBC 响应式数据库访问
- Modular Domain 架构（按功能模块划分）

**端口**: `8080`  
**路径示例** (实际路径取决于Router配置):
- `GET /news` - 获取新闻列表
- `GET /forum` - 获取论坛帖子

#### Frontend (前端)

**技术栈**: Next.js 15 + React + TypeScript + Tailwind CSS

**用途**: 面向用户的萌宠新闻和社区网站前端。

**特性**:
- Neubrutalism 设计风格（粗边框、硬阴影、高对比度）

**端口**:
- Admin前端: `5174` (Mock模式/Dev模式)
- Website前端: 见package.json配置

**文档**: [website/frontend/WORKFLOW_CN.md](./website/frontend/WORKFLOW_CN.md)

### Common 模块

**用途**: 共享工具类、常量定义、通用逻辑。

**内容**:
- 通用异常类
- 工具函数
- 通用配置

### Infra (基础设施)

**Docker**: 管理开发和测试环境的数据库和缓存。  
**Flyway**: SQL 迁移脚本，统一管理数据库 schema。

## ⚙️ 开发要求

### 通用规范

1. **代码风格**:
   - Java: 遵循 Google Java Style Guide
   - Kotlin: 遵循 Kotlin Coding Conventions
   - TypeScript: 使用 ESLint + Prettier

2. **Git 提交**:
   - 使用 Conventional Commits 格式
   - 例: `feat(news): add news detail page`

3. **分支策略**:
   - `main`: 生产分支
   - `develop`: 开发分支
   - `feature/*`: 功能分支
   - `hotfix/*`: 紧急修复分支

### Backend (Admin & Website)

#### ✅ 必须 (Dos)

1. **Repository 层**:
   - 所有数据库访问必须通过 Repository。
   - Admin: 使用 JPA Repository。
   - Website: 使用 R2DBC Reactive Repository。

2. **Service 层**:
   - 业务逻辑必须在 Service 层实现。
   - 使用 `@Transactional` 管理事务。
   - Website: Service 方法必须是 `suspend` 函数。

3. **DTO 使用**:
   - Controller/Handler 不能直接暴露 Entity。
   - 使用 DTO (Data Transfer Object) 进行数据传输。

4. **错误处理**:
   - 使用统一的异常处理机制。
   - 返回标准化的错误响应。

5. **日志记录**:
   - 使用 SLF4J + Logback。
   - 敏感信息（密码、Token）不得记录到日志。

6. **数据库迁移**:
   - 所有 schema 变更必须通过 Flyway 迁移脚本。
   - 文件命名: `V{version}__{description}.sql`

#### ❌ 禁止 (Don'ts)

1. **禁止在 Controller/Handler 中写业务逻辑**。
2. **禁止直接返回 Entity**（必须转换为 DTO）。
3. **禁止硬编码配置**（使用 `application.yml` 或环境变量）。
4. **禁止跨模块直接依赖**（通过接口或事件通信）。
5. **禁止提交敏感信息**（密码、密钥等写入配置文件，使用环境变量）。
6. **Website 禁止使用阻塞调用** (`block()`, `blockFirst()`)。
7. **禁止绕过 Flyway 直接修改数据库** schema。

### Frontend

请参考: [website/frontend/WORKFLOW_CN.md](./website/frontend/WORKFLOW_CN.md)

**核心禁止事项**:
- ❌ 禁止硬编码文本（必须使用 i18n）
- ❌ 禁止内联样式（使用 Tailwind）
- ❌ 禁止直接 fetch API（使用 Service 层）
- ❌ 禁止使用 `any` 类型

## 🧪 测试要求

1. **单元测试覆盖率**: 核心业务逻辑至少 80%。
2. **集成测试**: 所有 API 端点必须有集成测试。
3. **测试环境**: 使用独立的测试数据库（通过 `start-test.sh` 启动）。

```bash
# 运行所有测试
./gradlew test

# 运行特定模块测试
./gradlew :admin:test
./gradlew :website:test
```

## 📖 文档导航

| 文档 | 描述 |
|------|------|
| [QUICKSTART.md](./QUICKSTART.md) | 快速开始指南（必读！） |
| [website/frontend/WORKFLOW_CN.md](./website/frontend/WORKFLOW_CN.md) | 前端开发工作流 |
| [website/frontend/DEVELOPMENT_CN.md](./website/frontend/DEVELOPMENT_CN.md) | 前端组件和样式指南 |

## 🛠️ 技术栈总览

| 模块 | 语言 | 框架 | 数据库 | 缓存 |
|------|------|------|--------|------|
| Admin | Java 21 | Spring Boot 4.0 + JPA | PostgreSQL | Redis |
| Website Backend | Kotlin | Spring WebFlux + R2DBC | PostgreSQL | Redis |
| Website Frontend | TypeScript | Next.js 15 + React | - | - |
| Common | Kotlin | - | - | - |

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 License

本项目为内部项目，未开源。

---

**开始开发前，请务必阅读 [QUICKSTART.md](./QUICKSTART.md)！**
