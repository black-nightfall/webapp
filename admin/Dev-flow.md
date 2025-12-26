# New Feature Development Flow (新业务开发流程)

本文档旨在指导开发者如何基于现有的 **Pragmatic DDD** 架构高效、规范地开发一个新的业务功能模块。

开发顺序原则：**由内向外 (Inside-Out)**，即 `Domain` -> `Application` -> `Interface`。

---

## Step 1: 领域层 (Domain Layer)
**目标**: 定义业务核心数据结构和原子操作。

### 1.1 创建 Entity
在 `domain.{feature}.entity` 包下创建实体类。
*   **动作**: 定义类属性，添加 JPA 注解 (`@Entity`, `@Table`, `@Id`) 和 Lombok 注解 (`@Data`, `@Builder`)。
*   **注意事项**:
    *   不仅是数据容器，应包含核心业务校验逻辑（如果有）。
    *   使用 `@CreatedDate` 和 `@LastModifiedDate` 处理审计字段。
    *   **严禁**引用 Application 层或 Interface 层的类（如 DTO）。

### 1.2 创建 Repository
在 `domain.{feature}.repository` 包下创建接口。
*   **动作**: 继承 `JpaRepository<Entity, Long>`。
*   **注意事项**:
    *   只定义查询方法（如 `findByUsername`），不要包含业务逻辑。
    *   返回类型应为 `Optional<Entity>` 或 `List<Entity>`。

### 1.3 (可选) 创建 Domain Service
在 `domain.{feature}` 包下创建 `{Feature}Service`。
*   **适用场景**: 只有当逻辑涉及多个 Entity 交互，或逻辑过于复杂不适合放在 Entity 中时才创建。如果是简单的 CRUD，可以直接在 Application Service 中调用 Repository。
*   **注意事项**:
    *   方法参数和返回值应该是 Entity 或基本类型，**绝非** DTO。

---

## Step 2: 应用层 (Application Layer)
**目标**: 编排业务流程，处理事务，连接 UI 与领域。

### 2.1 定义 DTO
在 `application.dto.request` 和 `application.dto.response` 包下创建类。
*   **RequestDTO**: 包含前端传递的参数，使用 `@Valid` 相关注解（`@NotNull`, `@Size`）进行格式校验。
*   **ResponseDTO**: 定义返回给前端的数据结构，屏蔽数据库内部字段（如 `password`, `deleted`）。

### 2.2 创建 Mapper
在 `application.mapper` 包下创建转换器。
*   **动作**: 编写 `toDomain(RequestDTO)` 和 `toResponse(Entity)` 方法。
*   **注意事项**:
    *   将转换逻辑从 Service 中剥离，保持 Service 清爽。

### 2.3 创建 Application Service
在 `application.service` 包下创建 `{Feature}ApplicationService`。
*   **动作**:
    *   注入 `Repository` (或 `DomainService`) 和 `Mapper`。
    *   标注重写方法为 `@Transactional` (读写) 或 `@Transactional(readOnly = true)` (只读)。
*   **流程标准**:
    1.  **接收**: 接收 DTO。
    2.  **转换**: DTO -> Entity。
    3.  **执行**: 调用 Repository/DomainService 执行业务。
    4.  **转换**: Entity -> DTO。
    5.  **返回**: 返回 DTO。

---

## Step 3: 接口层 (Interface Layer)
**目标**: 暴露 API，处理 HTTP 协议。

### 3.1 创建 Controller
在 `interfaces` 包下创建 `{Feature}Controller`。
*   **动作**:
    *   使用 `@RestController` 和 `@RequestMapping`。
    *   注入 `ApplicationService`。
*   **注意事项**:
    *   **只做三件事**: 解析参数、调用 Service、包装统一响应 (`ApiResponse`)。
    *   不要在 Controller 里写任何业务逻辑（如 if-else 判断状态）。
    *   请求参数前必须加 `@Valid` 触发校验。

---

## 开发自检清单 (Checklist)

- [ ] **分包**: 新文件是否放在了正确的 `domain.{feature}` 包下？
- [ ] **依赖**: 是否确保了 `Domain` 层不依赖 `Application/Interface` 层？
- [ ] **事务**: 写操作（Create/Update/Delete）是否加上了 `@Transactional`？
- [ ] **校验**: RequestDTO 是否有必要的校验注解？
- [ ] **命名**: 是否符合 `Repository`, `Service`, `Controller` 的命名规范？