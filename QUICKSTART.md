# 🚀 快速开始指南

## 前置要求
- Docker 和 Docker Compose 已安装并运行
- Java 21 (推荐使用 [SDKMAN](https://sdkman.io/) 安装)

## 第一次运行

### 1. 环境准备

本项目使用 **Spring Boot Docker Compose** 自动管理依赖服务（PostgreSQL + Redis）。**无需手动启动Docker容器**。

确保 Docker Desktop 正在运行：
```bash
docker ps  # 应该能够正常执行
```

### 2. 启动Admin后端

```bash
# 在项目根目录执行
./gradlew :admin:bootRun

# 应用启动时会自动：
# 1. 拉取 PostgreSQL 和 Redis 镜像（首次运行）
# 2. 启动容器
# 3. 执行 Flyway 数据库迁移
# 4. 启动 Spring Boot 应用
```

等待启动成功，控制台会显示：
```
Started ApiApplication in X.XXX seconds
```

### 3. 访问应用

**Admin 后端 API**:
- 登录: http://localhost:9090/admin/auth/login
- 用户管理: http://localhost:9090/admin/users
- 角色管理: http://localhost:9090/admin/roles

**Admin 前端** (需单独启动):
```bash
cd admin/frontend
npm install
npm run dev -- --mode mock  # Mock模式，无需后端
# 或
npm run dev                 # 连接后端
# 访问: http://localhost:5174
```

**默认管理员账户**:
- 用户名: `superadmin`
- 密码: `admin123`

## 运行测试

```bash
# 运行所有测试（会自动使用测试数据库）
./gradlew :admin:test

# 运行特定测试类
./gradlew :admin:test --tests "com.night.admin.util.PasswordUtilTest"

# 运行单个测试方法
./gradlew :admin:test --tests "com.night.admin.util.PasswordUtilTest.测试密码加密"
```

## 环境管理

### 查看运行中的容器

```bash
docker ps
```

你应该看到类似这样的输出：

```
CONTAINER ID   IMAGE          STATUS         PORTS                    NAMES
abc123...      postgres:16    Up 2 minutes   0.0.0.0:5432->5432/tcp   admin-postgres-1
def456...      redis:7        Up 2 minutes   0.0.0.0:6379->6379/tcp   admin-redis-1
```

### 停止容器

```bash
# 停止所有容器（应用关闭时容器会自动停止）
# 如需手动停止：
docker stop admin-postgres-1 admin-redis-1

# 移除容器
docker rm admin-postgres-1 admin-redis-1
```

### 清理数据（重置数据库）

```bash
# ⚠️ 警告：这会删除所有数据！
docker volume ls  # 查看volumes
docker volume rm <volume_name>  # 删除对应的volume

# 重启应用会自动创建新的数据库
./gradlew :admin:bootRun
```

## 常见任务

### 查看日志

```bash
# 查看容器日志
docker logs -f admin-postgres-1
docker logs -f admin-redis-1

# 查看应用日志（在运行./gradlew :admin:bootRun的终端中）
```

### 连接数据库

```bash
# 使用Docker exec进入PostgreSQL
docker exec -it admin-postgres-1 psql -U appuser -d appdb

# 或使用数据库客户端工具连接
# Host: localhost
# Port: 5432
# Database: appdb
# Username: appuser
# Password: changeme
```

### 监控Redis

```bash
# 进入Redis CLI
docker exec -it admin-redis-1 redis-cli

# 查看所有keys
> KEYS *

# 查看特定key
> GET <key_name>
```

## 故障排查

### 问题：端口已被占用

```bash
# 查找占用端口的进程
lsof -i :5432
lsof -i :6379
lsof -i :9090

# 停止旧容器
docker ps -a | grep postgres
docker rm -f <container_id>
```

### 问题：容器启动失败

```bash
# 查看容器状态
docker ps -a

# 查看容器日志
docker logs admin-postgres-1
docker logs admin-redis-1

# 检查Docker是否运行
docker info
```

### 问题：数据库连接失败

1. 检查容器是否运行：`docker ps`
2. 检查应用配置：`admin/src/main/resources/application.yaml`
3. 查看应用启动日志
4. 尝试手动连接数据库验证

### 问题：Flyway迁移失败

```bash
# 查看迁移脚本
ls -la infra/db/migration/

# 检查数据库表
docker exec -it admin-postgres-1 psql -U appuser -d appdb -c "\dt"

# 查看Flyway历史
docker exec -it admin-postgres-1 psql -U appuser -d appdb -c "SELECT * FROM flyway_schema_history;"
```

## 下一步

- 阅读完整项目文档：[README.md](./README.md)
- 配置 IDE（IntelliJ IDEA / VS Code）
- 导入 Postman collection: `admin/src/main/resources/postman/Admin-Backend-API.postman_collection.json`
- 查看前端开发指南：[website/frontend/WORKFLOW_CN.md](./website/frontend/WORKFLOW_CN.md)

---

## 🌐 Website 模块快速开始

Website 模块是面向用户的新闻和论坛前端应用的后端 API，使用 **Spring WebFlux** (Reactor + Kotlin Coroutines) 和 **R2DBC**。

### 1. 启动 Website 后端

```bash
# Website模块复用相同的PostgreSQL和Redis
# 确保Docker Desktop运行中

# 启动 Website 应用
./gradlew :website:bootRun
```

访问示例:
- 新闻列表: `http://localhost:8080/news`
- 论坛列表: `http://localhost:8080/forum`

### 2. 创建你的第一个 API 端点 (以 Products 为例)

假设我们要为 "宠物用品" 添加一个新的 API 模块。

#### 步骤 1: 创建 Domain 模块结构

```bash
# 创建目录结构
mkdir -p website/src/main/kotlin/com/night/website/domain/product/entity
mkdir -p website/src/main/kotlin/com/night/website/domain/product/repository
mkdir -p website/src/main/kotlin/com/night/website/domain/product/service
```

#### 步骤 2: 定义 Entity (实体)

```kotlin
// website/src/main/kotlin/com/night/website/domain/product/entity/Product.kt
package com.night.website.domain.product.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal
import java.time.LocalDateTime

@Table("products")
data class Product(
    @Id
    val id: Long? = null,
    val name: String,
    val description: String,
    val price: BigDecimal,
    val imageUrl: String? = null,
    
    @CreatedDate
    val createdAt: LocalDateTime? = null,
    
    @LastModifiedDate
    val updatedAt: LocalDateTime? = null
)
```

#### 步骤 3: 创建 Repository

```kotlin
// website/src/main/kotlin/com/night/website/domain/product/repository/ProductRepository.kt
package com.night.website.domain.product.repository

import com.night.website.domain.product.entity.Product
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductRepository : ReactiveCrudRepository<Product, Long>
```

#### 步骤 4: 实现 Service

```kotlin
// website/src/main/kotlin/com/night/website/domain/product/service/ProductService.kt
package com.night.website.domain.product.service

import com.night.website.domain.product.entity.Product
import com.night.website.domain.product.repository.ProductRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service

@Service
class ProductService(private val productRepository: ProductRepository) {

    suspend fun getAll(): List<Product> = 
        productRepository.findAll().collectList().awaitSingle()
    
    suspend fun getById(id: Long): Product? = 
        productRepository.findById(id).awaitSingleOrNull()
    
    suspend fun create(product: Product): Product = 
        productRepository.save(product).awaitSingle()
}
```

#### 步骤 5: 添加 Handler

```kotlin
// website/src/main/kotlin/com/night/website/interfaces/handler/ProductHandler.kt
package com.night.website.interfaces.handler

import com.night.website.domain.product.entity.Product
import com.night.website.domain.product.service.ProductService
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.*

@Component
class ProductHandler(private val productService: ProductService) {
    
    suspend fun getAll(request: ServerRequest): ServerResponse {
        return ServerResponse.ok().bodyValueAndAwait(productService.getAll())
    }

    suspend fun getById(request: ServerRequest): ServerResponse {
        val id = request.pathVariable("id").toLongOrNull()
        return if (id != null) {
            val product = productService.getById(id)
            if (product != null) {
                ServerResponse.ok().bodyValueAndAwait(product)
            } else {
                ServerResponse.notFound().buildAndAwait()
            }
        } else {
            ServerResponse.badRequest().buildAndAwait()
        }
    }
    
    suspend fun create(request: ServerRequest): ServerResponse {
        val product = request.awaitBody<Product>()
        val created = productService.create(product)
        return ServerResponse.ok().bodyValueAndAwait(created)
    }
}
```

#### 步骤 6: 注册路由

```kotlin
// 在 website/src/main/kotlin/com/night/website/interfaces/RouterConfig.kt 中添加

import com.night.website.interfaces.handler.ProductHandler

@Configuration
class RouterConfig(
    // ... existing handlers
    private val productHandler: ProductHandler
) {

    @Bean
    fun apiRouter() = coRouter {
        accept(MediaType.APPLICATION_JSON).nest {
            "/api".nest {
                // ... existing routes
                "/products".nest {
                    GET("", productHandler::getAll)
                    GET("/{id}", productHandler::getById)
                    POST("", productHandler::create)
                }
            }
        }
    }
}
```

#### 步骤 7: 运行并测试

```bash
# 重启应用
./gradlew :website:bootRun

# 测试 API （实际路径取决于RouterConfig配置）
curl http://localhost:8080/products

# 创建产品
curl -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -d '{"name":"猫粮","description":"营养丰富","price":99.99}'
```

### 📋 Website 开发规范

#### ✅ 必须 (Dos)

1. **模块化设计**: 每个功能模块（如 `news`, `forum`, `product`）必须有独立的 `entity`, `repository`, `service` 包。
2. **Reactive 编程**: 所有 I/O 操作必须使用 `suspend` 函数和 Kotlin Coroutines。
3. **Audit 字段**: 所有实体必须包含 `createdAt` 和 `updatedAt` 字段（使用 `@CreatedDate` 和 `@LastModifiedDate`）。
4. **ID 类型**: 使用 `Long` 作为主键类型（对应数据库 `bigint`）。
5. **错误处理**: Handler 中必须处理 `null` 返回和无效 ID。

#### ❌ 禁止 (Don'ts)

1. **禁止阻塞调用**: 不要使用 `block()`, `blockFirst()`, `blockLast()`。
   - ❌ `repository.findAll().collectList().block()`
   - ✅ `repository.findAll().collectList().awaitSingle()`

2. **禁止混用 Reactor 和 Coroutines**: 在 `suspend` 函数中使用 `.asFlow()` 和 `.awaitXxx()`。
   - ❌ `repository.findAll().map { ... }.collectList().awaitSingle()` (Flux.map 内不能直接用 suspend)
   - ✅ `repository.findAll().asFlow().map { ... }.toList()`

3. **禁止硬编码数据库连接**: 所有配置必须在 `application.yml` 中。

4. **禁止跨模块直接访问 Repository**: Service 层是唯一可以访问 Repository 的地方。

5. **禁止在 Entity 中添加业务逻辑**: Entity 应该是纯数据类。

### 🧪 测试你的 API

```bash
# 编译检查
./gradlew :website:classes

# 运行测试（如果有）
./gradlew :website:test

# 启动应用
./gradlew :website:bootRun
```

## 💡 开发提示

### 热重载（DevTools）

项目已配置Spring Boot DevTools，修改代码后自动重新编译：

**IntelliJ IDEA配置**：
1. `Preferences → Compiler` → ✅ `Build project automatically`
2. `Cmd+Shift+A` → 搜索 `Registry` → ✅ `compiler.automake.allow.when.app.running`

修改代码后保存，等待1-2秒，应用会自动重启（非常快）。

### Postman测试

导入 Postman collection:
```
admin/src/main/resources/postman/Admin-Backend-API.postman_collection.json
```

**使用方法**：
1. 调用 Login 接口（自动保存token到变量）
2. 其他接口自动使用该token进行认证

### 前端开发

**Admin前端**：
```bash
cd admin/frontend
npm install
npm run dev -- --mode mock  # Mock模式（不需要后端）
npm run dev                 # Dev模式（连接后端API）
# 访问: http://localhost:5174
```

**Website前端**：
```bash
cd website/frontend
npm install
npm run dev
# 访问端口见控制台输出
```

## 🔧 常见问题

### 登录403 Forbidden

确保使用正确的账户：
- 用户名：`superadmin` （不是 admin）
- 密码：`admin123`
- 路径：`POST http://localhost:9090/admin/auth/login`

### 找不到API端点 (404)

检查路径是否正确，Admin API路径已移除 `/api` 前缀：
- ❌ 错误：`/admin/api/users/1`
- ✅ 正确：`/admin/users/1`

### Docker容器无法启动

```bash
# 检查Docker是否运行
docker info

# 查看更详细的错误
docker logs admin-postgres-1

# 清理并重启
docker rm -f admin-postgres-1 admin-redis-1
./gradlew :admin:bootRun  # 会重新创建容器
```

## 相关文档

- [Docker 环境配置详细文档](./infra/docker/README.md)
- [密码工具类使用指南](./admin/PASSWORD_UTIL_GUIDE.md)
- [前端开发工作流](./website/frontend/WORKFLOW_CN.md)
- [API 文档](./docs/)

