# Admin 后端模块

Admin 后端模块是基于 Spring Boot 和领域驱动设计（DDD）的现代化分层架构项目，采用 Kotlin 和 Java 混合开发。

## 架构概览

本项目采用四层架构设计：
- **接口层 (interfaces)**：负责 HTTP 请求处理，返回统一的 ApiResponse
- **应用层 (application)**：协调领域层操作，处理应用级事务，DTO 转换
- **领域层 (domain)**：核心业务逻辑，领域实体和领域服务
- **基础设施层 (infrastructure)**：数据访问，外部服务集成

## 目录结构

```
src/main/java/com/night/admin/
├── ApiApplication.java                 # Spring Boot 启动类
├── application/                        # 应用层
│   ├── dto/                          # 数据传输对象
│   │   ├── request/                  # 请求 DTO
│   │   │   ├── CreateOrderRequest.java
│   │   │   ├── CreateProductRequest.java
│   │   │   ├── CreateUserRequestDTO.java
│   │   │   └── LoginRequest.java
│   │   └── response/                 # 响应 DTO
│   │       ├── LoginResponse.java
│   │       ├── OrderResponseDTO.java
│   │       ├── ProductResponseDTO.java
│   │       ├── SessionInfoDTO.java
│   │       └── UserResponseDTO.java
│   ├── mapper/                       # 对象映射器
│   │   ├── AuthMapper.java
│   │   ├── OrderMapper.java
│   │   ├── ProductMapper.java
│   │   └── UserMapper.java
│   └── service/                      # 应用服务
│       ├── AuthApplicationService.java
│       ├── OrderApplicationService.java
│       ├── ProductApplicationService.java
│       └── UserApplicationService.java
├── config/                           # 配置类
│   ├── JpaConfig.java
│   ├── RedisConfig.java
│   └── SecurityConfig.java
├── domain/                           # 领域层
│   ├── auth/                         # 认证领域
│   │   ├── AuthService.java          # 认证领域服务
│   │   ├── TokenSessionService.java  # 令牌会话管理服务
│   │   └── security/                 # 安全组件
│   │       ├── CustomUserDetailsService.java
│   │       └── JwtAuthenticationFilter.java
│   ├── order/                        # 订单领域
│   │   ├── OrderService.java         # 订单领域服务
│   │   └── entity/                   # 订单领域实体
│   │       └── Order.java
│   ├── product/                      # 产品领域
│   │   ├── ProductService.java       # 产品领域服务
│   │   └── entity/                   # 产品领域实体
│   │       └── Product.java
│   └── user/                         # 用户领域
│       ├── UserService.java          # 用户领域服务
│       ├── UserDomainService.java    # 用户领域领域服务
│       └── entity/                   # 用户领域实体
│           └── User.java
├── exception/                        # 异常处理
│   ├── BusinessException.java
│   └── GlobalExceptionHandler.java
├── infrastructure/                   # 基础设施层
│   └── persistence/                  # 持久化
│       ├── entity/                   # JPA 实体
│       │   ├── OrderEntity.java
│       │   ├── ProductEntity.java
│       │   └── UserEntity.java
│       └── repository/               # 数据访问仓库
│           ├── OrderRepository.java
│           ├── ProductRepository.java
│           └── UserRepository.java
├── interfaces/                       # 接口层
│   ├── AuthController.java
│   ├── OrderController.java
│   ├── ProductController.java
│   ├── SessionController.java
│   └── UserController.java
└── util/                             # 工具类
    └── JwtUtil.java
```

## 各层职责

### 接口层 (interfaces)
- 负责 HTTP 请求处理
- 返回统一的 ApiResponse 格式
- 与前端进行数据交互

### 应用层 (application)
- 协调领域层操作
- 处理应用级事务
- DTO 转换和验证
- 包含服务编排逻辑

### 领域层 (domain)
- 核心业务逻辑实现
- 领域实体定义和操作
- 领域服务实现
- 业务规则和验证

### 基础设施层 (infrastructure)
- 数据访问和持久化
- 外部服务集成（如 Redis、数据库等）
- JPA 实体定义
- Repository 接口实现

## 技术栈

- **语言**: Java 17, Kotlin
- **框架**: Spring Boot 4.x
- **安全**: Spring Security, JWT
- **数据访问**: Spring Data JPA, PostgreSQL
- **缓存**: Redis
- **构建工具**: Gradle
- **依赖管理**: Gradle Version Catalogs

## API 响应格式

所有 API 接口返回统一格式的响应：

```json
{
  "code": 200,
  "message": "Success",
  "data": {},
  "timestamp": 1234567890123
}
```

## 错误码管理

使用统一的错误码管理机制，确保全系统错误码统一。

## 开发规范

1. 所有 DTO 都在应用层统一定义
2. 领域实体保持纯粹的业务逻辑职责，不包含 JPA 注解
3. JPA 注解仅存在于基础设施层的实体中
4. 各层之间依赖关系：上层可依赖下层，下层不可依赖上层
5. 使用公共模块的 ApiResponse 和 ErrorCode 以确保响应格式统一