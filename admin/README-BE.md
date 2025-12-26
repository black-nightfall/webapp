# Admin Module Backend Developer Guide

本文档定义了 Admin 模块后端开发的规范、架构界限及最佳实践。所有开发人员需严格遵守此文档。

## 1. 开发规范 (Development Standards)

本项目采用 **"Pragmatic DDD" (实用主义领域驱动设计)** 架构。我们不追求教科书式的完美分层，而是追求在 Spring Boot 生态下的**高内聚、低耦合与开发效率的平衡**。

### 核心原则
- **Rich Domain Model (充血模型)**: 领域实体 (`Entity`) 直接包含 JPA 注解和核心业务逻辑。不要创建独立的 POJO Domain Model 和 JPA Entity 互相映射，这在 CRUD 系统中是过度设计。
- **Package by Feature (按功能分包)**: 优先按业务功能（如 User, Product）分包，而不是按技术层（如 Service, Controller）分包。
- **Explicit Dependencies (显式依赖)**: 依赖关系必须单向流动：`Interface` -> `Application` -> `Domain`。

---

## 2. 包规范界限 (Package Boundaries)

代码库的根目录为 `src/main/java/com/night/admin`，包含以下顶层包：

| 包名 | 职责 (Responsibility) | 允许的依赖 (Allowed Dependencies) |
| :--- | :--- | :--- |
| **`interfaces`** | **接入层**。<br>负责处理 HTTP 请求、参数校验 (`@Valid`)、返回统一响应 (`ApiResponse`)。 | `application` |
| **`application`** | **应用层**。<br>负责编排业务流程、事务控制 (`@Transactional`)、DTO 与 Entity 的转换。不包含核心业务规则。 | `domain` |
| **`domain`** | **领域层**。<br>核心业务逻辑所在。包含 Entity、Repository 接口、Domain Service。 | **无** (不应依赖外层，仅依赖 JDK/Spring/Libs) |
| **`common`** | **通用层**。<br>全局通用的工具、常量、异常定义。 | 被所有层依赖 |

### Domain 内部结构 (Package by Feature)
在 `domain` 包下，每个业务模块应自包含所有相关类：

```
com.night.admin.domain.user/
├── entity/          # 实体 (唯一的持久化对象)
│   └── User.java
├── repository/      # 仓储接口 (extends JpaRepository)
│   └── UserRepository.java
└── UserService.java # 领域服务 (处理复杂业务规则)
```

---

## 3. 调用关系 (Call Hierarchy)

严禁跨层跳跃调用（例如 Controller 直接调用 Repository）。

```mermaid
graph TD
    A[Controller (Interface Layer)] -->|DTO| B[Application Service (Application Layer)]
    B -->|Entity| C[Domain Service (Domain Layer)]
    C -->|Entity| D[Repository (Domain Layer)]
    D -->|SQL| E[(Database)]
```

1.  **Request**: `Controller` 接收 `RequestDTO`。
2.  **Orchestration**: `Controller` 调用 `ApplicationService`。
3.  **Conversion**: `ApplicationService` 使用 `Mapper` 将 `RequestDTO` 转为 `Entity`。
4.  **Business Logic**: `ApplicationService` 调用 `DomainService` 或直接调用 `Repository` (仅限于简单 CRUD) 处理 `Entity`。
5.  **Response**: `ApplicationService` 将返回的 `Entity` 转为 `ResponseDTO` 返回给 `Controller`。

---

## 4. 代码命名规范 (Naming Conventions)

| 组件类型 | 命名后缀 | 示例 | 所在包 |
| :--- | :--- | :--- | :--- |
| **控制器** | `Controller` | `UserController` | `interfaces` |
| **应用服务** | `ApplicationService` | `UserApplicationService` | `application.service` |
| **请求对象** | `RequestDTO` | `CreateUserRequestDTO` | `application.dto.request` |
| **响应对象** | `ResponseDTO` | `UserResponseDTO` | `application.dto.response` |
| **转换器** | `Mapper` | `UserMapper` | `application.mapper` |
| **领域实体** | 无 (或直接使用名词) | `User` | `domain.{feature}.entity` |
| **领域服务** | `Service` | `UserService` | `domain.{feature}` |
| **仓储接口** | `Repository` | `UserRepository` | `domain.{feature}.repository` |

### 这里的关键点：
- **Entity**: 不要叫 `UserEntity`，直接叫 `User`。它是领域的核心。
- **Service**: `Domain Service` 不需要 `Domain` 后缀，因为它就是默认的服务 (`UserService`)。`Application Service` 需要明确后缀以示区分。

---

## 5. 异常处理
*   **BusinessException**: 处理所有业务逻辑错误（如“用户余额不足”），必须携带 `ErrorCode`。
*   **GlobalExceptionHandler**: 统一在 `interfaces` 层捕获异常并转为标准 `ApiResponse`。