# 常见问题汇总 (FAQ)

> 项目开发中的常见问题和解决方案汇总

## 📋 目录

- [环境和启动](#环境和启动)
- [数据库相关](#数据库相关)
- [API和后端](#api和后端)
- [前端开发](#前端开发)
- [Docker相关](#docker相关)
- [其他问题](#其他问题)

---

## 环境和启动

### Q: 需要安装哪些环境？

**最小要求**：
- Java 21
- Docker Desktop（必须）
- Node.js 18+（前端开发）

**无需安装**：
- Gradle（项目包含Wrapper）
- PostgreSQL（Docker自动管理）
- Redis（Docker自动管理）

### Q: 如何快速启动项目？

```bash
# 1. 确保Docker Desktop运行
docker ps

# 2. 启动后端（会自动启动PostgreSQL和Redis）
./gradlew :admin:bootRun

# 3. 启动前端
cd admin/frontend
npm install
npm run dev -- --mode mock
```

详见：[QUICKSTART.md](../QUICKSTART.md)

### Q: 端口被占用怎么办？

```bash
# 查找占用端口的进程
lsof -ti:9090  # Admin后端
lsof -ti:8080  # Website后端
lsof -ti:5174  # Admin前端

# 杀掉进程
kill -9 <PID>
```

---

## 数据库相关

### Q: 数据库连接失败？

**检查清单**：
1. Docker Desktop是否运行？`docker ps`
2. 容器是否启动？应该看到 `admin-postgres-1` 和 `admin-redis-1`
3. 查看容器日志：`docker logs admin-postgres-1`

**常见原因**：
- Docker Desktop未启动
- 端口5432被占用
- 容器启动失败

### Q: 如何重置数据库？

```bash
# 方法1: 删除容器（会丢失所有数据）
docker rm -f admin-postgres-1
./gradlew :admin:bootRun  # 重新启动会创建新容器

# 方法2: 手动删除数据（保留容器）
docker exec -it admin-postgres-1 psql -U appuser -d appdb -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Q: Flyway迁移失败怎么办？

```bash
# 查看迁移历史
docker exec -it admin-postgres-1 psql -U appuser -d appdb -c "SELECT * FROM flyway_schema_history;"

# 清理失败的迁移（谨慎！）
docker exec -it admin-postgres-1 psql -U appuser -d appdb -c "DELETE FROM flyway_schema_history WHERE success = false;"
```

### Q: 如何手动连接数据库？

```bash
# 使用docker exec
docker exec -it admin-postgres-1 psql -U appuser -d appdb

# 使用客户端工具
Host: localhost
Port: 5432
Database: appdb
Username: appuser
Password: apppass
```

---

## API和后端

### Q: 登录返回403 Forbidden？

**检查**：
1. 用户名是否正确？
   - ✅ 正确：`superadmin`
   - ❌ 错误：`admin`

2. API路径是否正确？
   - ✅ 正确：`POST http://localhost:9090/admin/auth/login`
   - ❌ 错误：`POST http://localhost:9090/admin/api/auth/login`

3. 请求体格式：
```json
{
  "username": "superadmin",
  "password": "admin123"
}
```

### Q: API返回404 Not Found？

**Admin API路径已移除 `/api` 前缀**：
- ❌ 错误：`/admin/api/users`
- ✅ 正确：`/admin/users`

**Website API无前缀**：
- ❌ 错误：`/api/news`
- ✅ 正确：`/news`

参考：[docs/API_STANDARDS.md](./API_STANDARDS.md)

### Q: 如何测试API？

**方法1：使用Postman**（推荐）
```bash
# 导入Collection
admin/src/main/resources/postman/Admin-Backend-API.postman_collection.json
```

**方法2：使用curl**
```bash
# 登录获取token
TOKEN=$(curl -X POST http://localhost:9090/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"admin123"}' \
  | jq -r '.data.token')

# 使用token访问受保护API
curl http://localhost:9090/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

### Q: 热重载不生效？

**检查DevTools配置**（IntelliJ IDEA）：
1. `Preferences → Compiler` → ✅ `Build project automatically`
2. `Cmd+Shift+A` → 搜索 `Registry` → ✅ `compiler.automake.allow.when.app.running`

修改代码后保存，等待1-2秒。

---

## 前端开发

### Q: 前端无法连接后端？

**检查**：
1. 后端是否运行？访问 `http://localhost:9090/admin/auth/login` 测试
2. 环境模式是否正确？
   - Mock模式：`npm run dev -- --mode mock`（不需要后端）
   - Dev模式：`npm run dev`（需要后端）

3. 代理配置是否正确？查看 `vite.config.ts`

### Q: 如何切换Mock/Dev模式？

```bash
# Mock模式（使用假数据，不需要后端）
npm run dev -- --mode mock

# Dev模式（连接真实后端）
npm run dev
```

查看：`.env.mock` 和 `.env.development`

### Q: 组件超过200行怎么办？

**必须拆分**！参考：
- [admin/frontend/CODING_STANDARDS.md](../admin/frontend/CODING_STANDARDS.md)

**拆分策略**：
- 表格columns过长 → 提取到单独文件
- Modal过大 → 移到 `components/`
- Page过大 → 业务逻辑提取到Hook

### Q: TypeScript报错 "any类型"？

**禁止使用any！** 替代方案：
```typescript
// ❌ 错误
const data: any = ...

// ✅ 正确：定义具体类型
interface User {
    id: number;
    username: string;
}
const data: User = ...

// ✅ 正确：使用unknown（需要类型检查）
const data: unknown = ...
if (typeof data === 'object') { ... }
```

---

## Docker相关

### Q: Docker容器无法启动？

```bash
# 检查Docker是否运行
docker info

# 查看容器状态
docker ps -a

# 查看容器日志
docker logs admin-postgres-1
docker logs admin-redis-1

# 清理并重启
docker rm -f admin-postgres-1 admin-redis-1
./gradlew :admin:bootRun
```

### Q: 容器占用过多磁盘空间？

```bash
# 查看Docker磁盘使用
docker system df

# 清理未使用的资源
docker system prune -a --volumes

# 仅清理停止的容器
docker container prune
```

### Q: 如何查看容器内部？

```bash
# 进入PostgreSQL容器
docker exec -it admin-postgres-1 bash

# 进入Redis容器
docker exec -it admin-redis-1 sh

# 查看Redis数据
docker exec -it admin-redis-1 redis-cli
```

---

## 其他问题

### Q: 构建失败怎么办？

```bash
# 清理并重新构建
./gradlew clean build --refresh-dependencies

# 仅清理
./gradlew clean

# 跳过测试构建（不推荐）
./gradlew build -x test
```

### Q: 测试失败怎么办？

```bash
# 运行单个测试类
./gradlew :admin:test --tests UserServiceTest

# 运行单个测试方法
./gradlew :admin:test --tests UserServiceTest.testCreateUser

# 查看测试报告
open admin/build/reports/tests/test/index.html
```

### Q: 如何添加新的依赖？

1. 在 `gradle/libs.versions.toml` 添加版本定义
2. 在模块的 `build.gradle.kts` 引用：
   ```kotlin
   implementation(libs.新依赖名称)
   ```

### Q: Git冲突怎么解决？

```bash
# 拉取最新代码
git fetch upstream
git merge upstream/main

# 解决冲突后
git add .
git commit -m "fix: 解决合并冲突"
```

### Q: 找不到相关文档？

**文档索引**：
- **AI导航**: [docs/AI_CONTEXT_INDEX.md](./AI_CONTEXT_INDEX.md)
- **快速开始**: [QUICKSTART.md](../QUICKSTART.md)
- **Admin后端**: [admin/README.md](../admin/README.md)
- **Admin前端**: [admin/frontend/README.md](../admin/frontend/README.md)
- **Website后端**: [website/README.md](../website/README.md)
- **Website前端**: [website/frontend/README.md](../website/frontend/README.md)

---

## 仍然有问题？

1. 搜索 [GitHub Issues](https://github.com/YOUR_REPO/issues)
2. 查看模块的详细文档
3. 创建新Issue并详细描述问题
4. 联系团队成员

---

**大部分问题都能在文档中找到答案！** 📖
