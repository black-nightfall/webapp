# 🚀 快速开始指南

## 前置要求
- Docker 和 Docker Compose 已安装
- JDK 17+
- Gradle 8.0+

## 第一次运行

### 1. 启动开发环境

```bash
# 进入 Docker 目录
cd infra/docker

# 启动开发环境容器
./start-dev.sh

# 等待容器完全启动（约 10 秒）
```

### 2. 运行应用

```bash
# 返回项目根目录
cd ../..

# 运行应用（开发模式）
./gradlew :admin:bootRun

# 或者使用环境变量方式
export SPRING_PROFILES_ACTIVE=dev
./gradlew :admin:bootRun
```

### 3. 测试应用

访问: `http://localhost:9090/admin`

默认管理员账户:
- 用户名: `admin`
- 密码: `admin123`

## 运行测试

### 1. 启动测试环境

```bash
# 进入 Docker 目录
cd infra/docker

# 启动测试环境容器（使用不同的端口，不会与开发环境冲突）
./start-test.sh
```

### 2. 执行测试

```bash
# 返回项目根目录
cd ../..

# 运行所有测试
./gradlew :admin:test

# 运行特定测试
./gradlew :admin:test --tests "com.night.admin.util.PasswordUtilTest"
```

## 环境管理

### 查看运行中的容器

```bash
docker ps
```

你应该看到类似这样的输出：

```
CONTAINER ID   IMAGE           STATUS         PORTS                    NAMES
abc123...      postgres:15     Up 2 minutes   0.0.0.0:5432->5432/tcp   webapp_postgres_dev
def456...      redis:7-alpine  Up 2 minutes   0.0.0.0:6379->6379/tcp   webapp_redis_dev
```

### 停止环境

```bash
# 停止开发环境
cd infra/docker
./stop-dev.sh

# 停止测试环境
./stop-test.sh
```

### 同时运行开发和测试环境

```bash
# 在一个终端窗口
cd infra/docker
./start-dev.sh

# 在另一个终端窗口
cd infra/docker
./start-test.sh

# 验证两个环境都在运行
docker ps
```

你应该看到 6 个容器（每个环境 3 个）：
- `webapp_postgres_dev` (端口 5432)
- `webapp_postgres_test` (端口 5433)
- `webapp_redis_dev` (端口 6379)
- `webapp_redis_test` (端口 6380)
- `webapp_flyway_dev`
- `webapp_flyway_test`

## 常见任务

### 查看日志

```bash
# 开发环境日志
docker-compose -f infra/docker/docker-compose.dev.yml logs -f

# 测试环境日志
docker-compose -f infra/docker/docker-compose.test.yml logs -f

# 只看数据库日志
docker logs -f webapp_postgres_dev
```

### 连接数据库

```bash
# 开发环境
docker exec -it webapp_postgres_dev psql -U appuser -d appdb_dev

# 测试环境
docker exec -it webapp_postgres_test psql -U appuser_test -d appdb_test
```

### 重置数据库（清空所有数据）

```bash
# ⚠️ 警告：这会删除所有数据！

# 开发环境
cd infra/docker
./stop-dev.sh
docker volume rm docker_db_dev_data docker_redis_dev_data
./start-dev.sh

# 测试环境
./stop-test.sh
docker volume rm docker_db_test_data docker_redis_test_data
./start-test.sh
```

## 环境配置

### 自定义端口

如果默认端口已被占用，编辑 `.env.dev` 或 `.env.test` 文件：

```bash
cd infra/docker

# 编辑开发环境配置
nano .env.dev

# 修改端口
POSTGRES_PORT=5434  # 改为其他端口
REDIS_PORT=6381     # 改为其他端口
```

然后重启容器：

```bash
./stop-dev.sh
./start-dev.sh
```

## 故障排查

### 问题：端口已被占用

```bash
# 查找占用端口的进程
lsof -i :5432
lsof -i :6379

# 停止旧容器
docker ps -a | grep postgres
docker rm -f <container_id>
```

### 问题：容器启动失败

```bash
# 查看详细日志
docker-compose -f infra/docker/docker-compose.dev.yml logs

# 检查容器状态
docker-compose -f infra/docker/docker-compose.dev.yml ps
```

### 问题：数据库连接失败

1. 检查容器是否运行：`docker ps`
2. 检查端口是否正确
3. 检查环境变量是否正确配置
4. 查看应用日志

### 问题：测试连接到开发数据库

确保在运行测试时使用 `test` profile：

```bash
# 检查环境变量
echo $SPRING_PROFILES_ACTIVE

# 显式指定
./gradlew :admin:test -Dspring.profiles.active=test
```

## 下一步

- 阅读完整文档：[infra/docker/README.md](infra/docker/README.md)
- 配置 IDE（IntelliJ IDEA / VS Code）
- 设置 Git hooks
- 配置 CI/CD

---

## 🌐 Website 模块快速开始

Website 模块是面向用户的新闻和论坛前端应用的后端 API，使用 **Spring WebFlux** (Reactor + Kotlin Coroutines) 和 **R2DBC**。

### 1. 启动 Website 后端

```bash
# 确保数据库和 Redis 已启动（复用 admin 的基础设施）
cd infra/docker
./start-dev.sh

# 启动 Website 应用
cd ../..
./gradlew :website:bootRun
```

访问: `http://localhost:8080/api/news`

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

# 测试 API
curl http://localhost:8080/api/products

# 创建产品
curl -X POST http://localhost:8080/api/products \
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

## 相关文档

- [Docker 环境配置详细文档](./infra/docker/README.md)
- [密码工具类使用指南](./admin/PASSWORD_UTIL_GUIDE.md)
- [前端开发工作流](./website/frontend/WORKFLOW_CN.md)
- [API 文档](./docs/)

