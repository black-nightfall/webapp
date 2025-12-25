# Admin 后端开发手册

## 目录结构

```
src/main/java/com/night/admin/
├── ApiApplication.java                 # Spring Boot 应用入口
├── application/                        # 应用层
│   ├── dto/                          # 数据传输对象
│   │   ├── request/                  # 请求 DTO
│   │   └── response/                 # 响应 DTO
│   ├── mapper/                       # DTO 映射器
│   └── service/                      # 应用服务
├── config/                           # 配置类
├── domain/                           # 领域层
│   ├── entity/                       # 领域实体
│   └── service/                      # 领域服务
├── exception/                        # 异常处理
├── infrastructure/                   # 基础设施层
│   ├── persistence/                  # 持久化实现
│   │   ├── entity/                   # 持久化实体
│   │   └── repository/               # 持久化仓库
├── interfaces/                       # 接口层 (Controller)
└── util/                             # 工具类
```

## 开发规范

### 1. 分层架构规范
- **接口层 (interfaces)**: 负责HTTP请求处理，返回统一的 [ApiResponse](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ApiResponse.kt)
- **应用层 (application)**: 协调领域层操作，处理应用级事务，DTO转换
- **领域层 (domain)**: 核心业务逻辑，领域实体和领域服务
- **基础设施层 (infrastructure)**: 数据库访问，外部服务集成

### 2. 命名规范
- Controller类: `*Controller`
- Service类: `*ApplicationService` (应用层) 或 `*DomainService` (领域层)
- DTO类: `*Request` (请求) 或 `*ResponseDTO` (响应)
- Entity类: `*Entity` (持久化实体) 或 `*` (领域实体)

### 3. 错误处理
- 使用统一的 [ApiResponse](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ApiResponse.kt) 和 [ErrorCode](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ErrorCode.kt) 枚举
- 所有异常都应被适当处理并返回有意义的错误码

### 4. 依赖关系
- 上层可依赖下层，下层不可依赖上层
- 同层间不应直接依赖
- 业务逻辑应集中在领域层

## 禁止规则

### 1. 架构层面
- ❌ Controller直接访问Repository
- ❌ 领域层依赖基础设施层的具体实现
- ❌ 跨层直接调用（如Controller直接调用DomainService）

### 2. 代码层面
- ❌ 在领域实体中直接使用JPA注解（应使用持久化实体）
- ❌ 暴露持久化实体到外部层
- ❌ 在应用层处理核心业务逻辑

### 3. 数据处理
- ❌ Controller直接返回Entity对象
- ❌ 在Controller中进行复杂业务逻辑处理
- ❌ 跳过DTO直接传递数据

## 技术栈

- **框架**: Spring Boot 4.0
- **持久化**: Spring Data JPA, PostgreSQL
- **安全**: Spring Security, JWT
- **缓存**: Redis
- **数据库迁移**: Flyway
- **API响应**: 统一使用 [ApiResponse](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ApiResponse.kt)
- **错误码**: 使用 [ErrorCode](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ErrorCode.kt) 枚举

## 公共模块集成

- 使用父工程的 `common` 模块中的 [ApiResponse](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ApiResponse.kt) 和 [ErrorCode](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ErrorCode.kt)
- 避免重复实现公共功能
- 保持错误码和响应格式的一致性