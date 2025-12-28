# Admin Backend - 开发文档

> 后台管理系统后端 - Spring Boot + JPA + PostgreSQL + Redis + JWT
> **架构模式**: 实用主义DDD (Pragmatic Domain-Driven Design)

## 📋 目录

- [⚡ 快速开始](#-快速开始) (New Joiner Start Here!)
- [🤖 AI/Vibecode 指南](#-aivibecode-指南) (AI Context)
- [🛠️ 技术栈](#-技术栈)
- [🏗️ 架构设计](#-架构设计)
- [📁 目录结构](#-目录结构)
- [📝 开发规范](#-开发规范)

---

## ⚡ 快速开始

### 1. 环境准备
确保本地安装以下环境：
- **Java 21**
- **Docker & Docker Compose** (必须安装并运行，用于自动启动依赖服务)

### 2. 启动项目
本项目整合了 `spring-boot-docker-compose`，启动应用时会自动拉取并运行 PostgreSQL 和 Redis 容器。**无需手动执行 `docker run`**。

```bash
# 1. 确保在项目根目录 (webapp/)
# 2. 运行启动命令
./gradlew :admin:bootRun
```

### 3. 验证服务

启动成功后，按以下方式验证：

**方式1: 查看日志** ⭐ 推荐
启动成功会在控制台看到：
```
Started ApiApplication in X.XXX seconds (process running on port 9090)
```

**方式2: 测试登录API**
```bash
# 登录测试
curl -X POST http://localhost:9090/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 预期返回（包含token）
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "username": "admin"
  }
}
```

**方式3: 查看Docker容器**
```bash
# 查看运行的容器
docker ps

# 应该看到postgres和redis容器
CONTAINER ID   IMAGE          PORTS
xxx            postgres:16    0.0.0.0:5432->5432/tcp
xxx            redis:7        0.0.0.0:6379->6379/tcp
```

**方式4: 访问前端**（完整验证）
1. 启动前端：`cd frontend && npm run dev -- --mode mock`
2. 访问：http://localhost:5173
3. 使用 `admin/admin123` 登录

详见：`frontend/README.md`

---

### 🎯 新人第一步（重要！）

完成启动后，按以下步骤快速上手：

#### Step 1: 浏览现有代码（15分钟）

**用户模块** - 完整标准实现：
```bash
# 打开以下文件，理解DDD架构
src/main/java/com/night/admin/domain/user/entity/User.java
src/main/java/com/night/admin/domain/user/repository/UserRepository.java
src/main/java/com/night/admin/domain/user/service/UserService.java
src/main/java/com/night/admin/application/service/UserApplicationService.java
src/main/java/com/night/admin/interfaces/UserController.java
```

**关键理解点**：
- `Controller` 仅调用 `ApplicationService`
- `ApplicationService` 可直接访问 `Repository`（简单查询）
- `ApplicationService` 调用 `DomainService`（复杂业务，如密码加密）

#### Step 2: 尝试第一个任务（30分钟）

**任务**：为Product模块添加一个简单的查询接口

要求：
- 实现 GET /admin/products（返回列表）
- 参考user模块的代码结构
- 使用curl测试API

**参考**：跳转到 [代码模板](#代码模板) 章节

#### Step 3: 常见问题自查

遇到问题？先查看 [常见问题](#常见问题) 章节。

---

## 🤖 AI/Vibecode 指南

> **For AI Agents & Vibecode**: 阅读此部分以准确理解上下文。

### 核心上下文
1.  **架构风格**: **实用主义 DDD** (Pragmatic DDD)。
    -   **允许**: `ApplicationService` 直接调用 `Repository` 进行简单查询。
    -   **禁止**: `Controller` 直接调用 `Repository` 或 `DomainService`。
    -   **事务**: 统一在 `ApplicationService` 层管理 (`@Transactional`)。
2.  **配置源**:
    -   **主要配置**: `src/main/resources/application.yaml` (端口 `9090`, Context `/admin`)
    -   **依赖管理**: `../../gradle/libs.versions.toml` (Version Catalog)
3.  **关键文件位置**:
    -   Entity: `src/main/java/com/night/admin/domain/{module}/entity/`
    -   Repository: `src/main/java/com/night/admin/domain/{module}/repository/`
    -   Service (App): `src/main/java/com/night/admin/application/service/`

### 代码生成规则
- **事务管理**: 生成写操作方法时，务必在 `ApplicationService` 添加 `@Transactional`。
- **DTO 转换**: 始终使用 MapStruct Mapper 或手动转换，严禁将 Entity 直接返回给 Controller。
- **Lombok**: 广泛使用 `@Data`, `@RequiredArgsConstructor`。
- **构建工具**: 使用 Kotlin DSL (`build.gradle.kts`)，通过 `libs.xxxx` 引用依赖。

### 代码模板

#### 1. Entity定义
```java
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

#### 2. Repository接口
```java
public interface ProductRepository extends 
    JpaRepository<Product, Long>,
    JpaSpecificationExecutor<Product> {
    
    Optional<Product> findByName(String name);
    boolean existsByName(String name);
}
```

#### 3. DTO定义
```java
// Request DTO
@Data
public class CreateProductRequestDTO {
    @NotBlank(message = "名称不能为空")
    private String name;
    
    @NotNull(message = "价格不能为空")
    @DecimalMin(value = "0.01", message = "价格必须大于0")
    private BigDecimal price;
}

// Response DTO
@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private LocalDateTime createdAt;
}
```

#### 4. Mapper
```java
@Component
public class ProductMapper {
    public ProductResponseDTO toResponseDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }
    
    public Product toDomain(CreateProductRequestDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        return product;
    }
}
```

#### 5. ApplicationService模板
```java
@Service
@Slf4j
@RequiredArgsConstructor
public class ProductApplicationService {
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    // private final ProductService productService;  // 如需复杂业务逻辑
    
    // ===== 简单查询 - 直接用Repository =====
    @Transactional(readOnly = true)
    public ProductResponseDTO getById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new BusinessException("产品不存在"));
        return productMapper.toResponseDTO(product);
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> search(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(productMapper::toResponseDTO);
    }
    
    // ===== 简单保存 - 直接用Repository =====
    @Transactional
    public ProductResponseDTO create(CreateProductRequestDTO request) {
        // 检查名称唯一性
        if (productRepository.existsByName(request.getName())) {
            throw new BusinessException("产品名称已存在");
        }
        
        Product product = productMapper.toDomain(request);
        Product saved = productRepository.save(product);
        return productMapper.toResponseDTO(saved);
    }
    
    // ===== 复杂业务 - 调用DomainService =====
    // @Transactional
    // public ProductResponseDTO createWithInventory(CreateProductRequestDTO request) {
    //     // 复杂逻辑：创建产品并初始化库存
    //     Product product = productService.createWithInventory(request);
    //     return productMapper.toResponseDTO(product);
    // }
}
```

#### 6. Controller模板
```java
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductApplicationService productApplicationService;
    
    @GetMapping("/{id}")
    public ApiResponse<ProductResponseDTO> getProduct(@PathVariable Long id) {
        ProductResponseDTO product = productApplicationService.getById(id);
        return ApiResponse.success(product);
    }
    
    @GetMapping
    public ApiResponse<Page<ProductResponseDTO>> searchProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ProductResponseDTO> products = productApplicationService.search(pageable);
        return ApiResponse.success(products);
    }
    
    @PostMapping
    public ApiResponse<ProductResponseDTO> createProduct(
        @Valid @RequestBody CreateProductRequestDTO request) {
        ProductResponseDTO product = productApplicationService.create(request);
        return ApiResponse.success(product);
    }
}
```

### ApplicationService访问数据决策树

```
需要访问数据？
├─ 是否涉及复杂业务规则？
│  ├─ 是 → 调用 Domain Service
│  │   示例：
│  │   • 创建用户（密码加密、唯一性校验）✅
│  │   • 订单支付（扣减库存、积分计算）✅
│  │   • 权限分配（验证层级关系）✅
│  │
│  └─ 否 → 直接用 Repository
│      示例：
│      • 分页查询列表 ✅
│      • 根据ID查询 ✅
│      • 简单的CRUD（无业务规则）✅
```

**判断标准**：
- ✅ 用DomainService：业务逻辑 > 3行，或涉及多个Entity
- ✅ 用Repository：纯CRUD，无复杂计算或验证

---

## 🛠️ 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| **Spring Boot** | 3.4.x | 核心框架 |
| **PostgreSQL** | 16+ | 持久层 (Docker自动管理) |
| **Spring Data JPA**| - | ORM |
| **Redis** | 7+ | Session & Cache (Docker自动管理) |
| **Flyway** | - | 数据库迁移 |
| **Docker Compose** | - | 开发环境集成 |

**依赖管理**:
所有依赖版本在根目录 `gradle/libs.versions.toml` 中定义，子模块通过 catalog 引用。

---

## 🏗️ 架构设计

### 分层架构图
```mermaid
graph TD
    User((User/Client)) --> API[Interfaces Layer<br>(Controller)]
    API --> App[Application Layer<br>(Application Service)]
    
    subgraph "Domain Layer"
        Entity[Entity]
        RepoInterface[Repository Interface]
        DomainSvc[Domain Service]
    end
    
    App --> DomainSvc
    App --> RepoInterface
    DomainSvc --> Entity
    DomainSvc --> RepoInterface
    
    subgraph "Infrastructure Layer"
        DB[(PostgreSQL)]
        Cache[(Redis)]
        RepoImpl[JPA Repository Impl]
    end
    
    RepoInterface -.-> RepoImpl
    RepoImpl --> DB
```

### 核心原则
1.  **接口层 (Interfaces)**: 处理 HTTP 请求，参数校验 (@Valid)，返回 DTO。
2.  **应用层 (Application)**: 编排业务，事务边界。**可以** 直接调用 Repository 处理简单查询（实用主义）。
3.  **领域层 (Domain)**: 业务核心。Entity 包含基本状态和行为（非贫血模型为佳，但目前偏向贫血+Service）。
4.  **基础设施层 (Infrastructure)**: 下沉在框架中（Spring Data JPA, Redis Template）。

---

## 📁 目录结构

```
webapp/
├── build.gradle.kts          # Root build setup
├── gradle/libs.versions.toml # Version Catalog
├── infra/                    # Shared infrastructure (Docker, DB Scripts)
│   ├── db/migration/         # Flyway SQL scripts
│   └── docker/               # Docker Compose files
└── admin/                    # Current Module
    ├── build.gradle.kts
    └── src/main/
        ├── resources/
        │   └── application.yaml  # Main Configuration
        └── java/com/night/admin/
            ├── interfaces/       # Controllers
            ├── application/      # Services, DTOs, Mappers
            ├── domain/           # Entities, Repositories
            └── ...
```

---

## 📝 开发规范

### 1. 新建模块流程 (New Features)
1.  **Domain**: 定义 `Entity` 和 `Repository` 接口。
2.  **App**: 定义 `Request/Response DTO`。
3.  **App**: 创建 `ApplicationService`，实现业务逻辑。
4.  **Interface**: 创建 `Controller` 暴露接口。
5.  **Infra**: 在 `infra/db/migration` 添加 SQL 脚本 (如需建表)。

### 2. 数据库迁移 (Flyway)
SQL 脚本位于 `webapp/infra/db/migration`。
- 命名: `V{版本号}__{描述}.sql` (例如 `V1.2__create_product_table.sql`)
- 注意: `spring-boot-docker-compose` 启动时会自动执行迁移。

### 3. API 规范

#### 路径规范
- **统一前缀**: `/admin`（已在application.yaml配置）
- **资源路径**: `/admin/{resource}` (例如 `/admin/users`)
- **RESTful动词**: GET, POST, PUT, DELETE

#### 响应格式
所有API统一返回 `ApiResponse<T>` 格式（定义在common模块）：

**成功响应**：
```json
{
  "success": true,
  "data": { ... },        // 或数组 [...]
  "message": "操作成功",
  "code": 200
}
```

**错误响应**：
```json
{
  "success": false,
  "message": "错误描述",
  "code": 400
}
```

#### 分页格式
使用Spring Data JPA的 `Page<T>`：

**请求**：
```bash
GET /admin/products?page=0&size=10&sortBy=createdAt&sortDirection=DESC
```

**响应**：
```json
{
  "success": true,
  "data": {
    "content": [...],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0
  }
}
```

#### 参数校验
使用Bean Validation（`@Valid`）：
- `@NotBlank` - 字符串非空
- `@NotNull` - 对象非空
- `@Size(min, max)` - 字符串长度
- `@Email` - 邮箱格式
- `@DecimalMin` - 数字最小值

---

## 常见问题

### Q1: 启动失败，端口9090被占用
```bash
# 查找占用端口的进程
lsof -ti:9090
# 杀掉进程
kill -9 <PID>

# 或修改端口（application.yaml）
server:
  port: 8080
```

### Q2: Docker容器无法启动
**检查**：
```bash
# 确保Docker Desktop正在运行
docker ps  # 应该能执行

# 查看docker-compose日志
docker-compose logs
```

### Q3: 数据库连接失败
检查`compose.yaml`中的PostgreSQL配置：
```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: admin_db
      POSTGRES_PASSWORD: postgres
```

### Q4: Flyway迁移失败
```bash
# 检查SQL脚本
ls -la ../infra/db/migration/

# 查看Flyway状态（启动日志）
# 或手动执行迁移
./gradlew flywayMigrate
```

### Q5: 依赖无法解析
```bash
# 清理并重新构建
./gradlew clean build --refresh-dependencies
```

### Q6: ApplicationService应该调用Repository还是DomainService？
参考 [决策树](#applicationservice访问数据决策树)：
- 简单CRUD → Repository
- 复杂业务（>3行逻辑）→ DomainService

---

**Happy Coding!** 🚀
