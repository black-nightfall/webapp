# Add API Plan Flow (基于现有模块添加新API流程)

> **AI助手说明**：本文档是为AI代码助手设计的开发工作流指南。遵循此流程可以确保生成的代码符合项目的DDD架构规范。

本文档指导开发者如何在现有业务模块（如 User、Product、Order）中追加新的 API 端点。遵循 **Pragmatic DDD** 架构原则，确保代码的一致性和可维护性。

## 🤖 AI使用指南

当用户请求"添加新API"时，请按照以下步骤操作：

1. **分析需求**：明确业务场景、所属模块、HTTP方法、请求参数、返回数据
2. **选择模板**：根据API类型选择对应章节（单记录操作 vs 列表查询）
3. **Inside-Out实现**：Domain → Application → Interface
4. **验证编译**：完成后运行 `./gradlew :admin:compileJava`
5. **提供总结**：说明创建/修改了哪些文件

---

## 项目结构概览

```
admin/
├── src/main/java/com/night/admin/
│   ├── domain/              # 领域层
│   │   ├── user/
│   │   │   ├── entity/      # 实体类
│   │   │   ├── repository/  # 仓储接口
│   │   │   └── UserService.java  # (可选) 领域服务
│   │   ├── product/
│   │   ├── order/
│   │   └── auth/
│   ├── application/         # 应用层
│   │   ├── dto/
│   │   │   ├── request/     # 请求DTO
│   │   │   └── response/    # 响应DTO
│   │   ├── mapper/          # DTO与实体转换器
│   │   └── service/         # 应用服务
│   ├── interfaces/          # 接口层
│   │   └── *Controller.java # REST控制器
│   ├── config/              # 配置类
│   ├── exception/           # 异常处理
│   └── util/                # 工具类
└── common/                  # 通用模块（ApiResponse等）
```

---

## API开发流程（Inside-Out）

### 前置分析：确定API需求

在开始编码前，明确以下问题：
1. **业务场景**: 这个API要解决什么问题？（如：更新用户密码、查询订单列表）
2. **所属模块**: 属于哪个现有模块？（User / Product / Order / Auth）
3. **HTTP方法**: GET（查询）/ POST（创建）/ PUT（更新）/ DELETE（删除）
4. **请求参数**: 需要哪些输入数据？
5. **返回数据**: 需要返回哪些字段？
6. **业务规则**: 有什么特殊校验或处理逻辑？

---

### Step 1: 领域层扩展 (Domain Layer)

#### 1.1 检查 Entity 是否需要修改
**路径**: `domain.{feature}.entity/{Entity}.java`

**场景1**: 如果新API涉及新的数据字段
- **动作**: 在实体类中添加新字段，并添加相应的JPA注解
- **示例**: 为 `User` 添加 `lastLoginTime` 字段
```java
@Entity
@Table(name = "users")
@Data
@Builder
public class User {
    // ... existing fields
    
    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;
}
```

**场景2**: 如果只是基于现有字段的查询/操作
- **动作**: 无需修改 Entity

#### 1.2 扩展 Repository
**路径**: `domain.{feature}.repository/{Feature}Repository.java`

**场景1**: 需要新的查询方法
```java
public interface UserRepository extends JpaRepository<User, Long> {
    // 新增自定义查询方法
    Optional<User> findByEmail(String email);
    
    List<User> findByStatusAndCreatedAtAfter(String status, LocalDateTime date);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword%")
    Page<User> searchByUsername(@Param("keyword") String keyword, Pageable pageable);
}
```

**场景2**: 使用现有方法
- **动作**: 无需修改

#### 1.3 更新 Domain Service（可选）
**路径**: `domain.{feature}/{Feature}Service.java`

**仅在以下情况创建/修改**:
- 涉及多个实体的交互
- 复杂的业务逻辑（不适合放在Application层）

**示例**: 用户密码重置逻辑
```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public User resetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
        
        // 业务规则: 密码强度校验
        validatePasswordStrength(newPassword);
        
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
}
```

---

### Step 2: 应用层扩展 (Application Layer)

#### 2.1 创建 Request DTO
**路径**: `application.dto.request/{Feature}{Action}RequestDTO.java`

**命名规范**: `{Feature}{Action}RequestDTO`（如 `UpdateUserPasswordRequestDTO`）

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserPasswordRequestDTO {
    
    @NotBlank(message = "旧密码不能为空")
    private String oldPassword;
    
    @NotBlank(message = "新密码不能为空")
    @Size(min = 8, max = 20, message = "密码长度必须在8-20个字符之间")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", 
             message = "密码必须包含大小写字母和数字")
    private String newPassword;
}
```

**关键点**:
- 使用 `@Valid` 相关注解进行参数校验
- 不包含敏感的内部字段（如 `id`、`createdAt`）

#### 2.2 创建/复用 Response DTO
**路径**: `application.dto.response/{Feature}ResponseDTO.java`

**场景1**: 复用现有DTO（如标准的 `UserResponseDTO`）
```java
// 无需创建新DTO，直接使用现有的
```

**场景2**: 创建新的专用DTO（如只返回部分字段）
```java
@Data
@Builder
public class UserProfileResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String avatar;
    // 不包含敏感信息（password, deleted等）
}
```

#### 2.3 扩展 Mapper
**路径**: `application.mapper/{Feature}Mapper.java`

添加新的转换方法：
```java
@Component
public class UserMapper {
    
    // 现有方法...
    
    // 新增：RequestDTO -> Entity (部分字段更新)
    public void updatePasswordFromRequest(User user, UpdateUserPasswordRequestDTO request) {
        // 密码加密在 Domain Service 中处理，这里只做数据传递
    }
    
    // 新增：Entity -> 自定义ResponseDTO
    public UserProfileResponseDTO toProfileResponse(User user) {
        return UserProfileResponseDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .avatar(user.getAvatar())
            .build();
    }
}
```

#### 2.4 扩展 Application Service
**路径**: `application.service/{Feature}ApplicationService.java`

添加新的业务方法：
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserApplicationService {
    
    private final UserRepository userRepository;
    private final UserService userService;  // 如果有Domain Service
    private final UserMapper userMapper;
    
    // 新增方法
    @Transactional
    public UserResponseDTO updatePassword(Long userId, UpdateUserPasswordRequestDTO request) {
        log.info("更新用户密码: userId={}", userId);
        
        // 1. 调用 Domain Service 执行核心业务逻辑
        User updatedUser = userService.resetPassword(userId, request.getNewPassword());
        
        // 2. 转换为 ResponseDTO
        return userMapper.toResponse(updatedUser);
    }
    
    @Transactional(readOnly = true)
    public Page<UserResponseDTO> searchUsers(String keyword, Pageable pageable) {
        Page<User> users = userRepository.searchByUsername(keyword, pageable);
        return users.map(userMapper::toResponse);
    }
}
```

**关键原则**:
- **写操作**: 使用 `@Transactional`
- **读操作**: 使用 `@Transactional(readOnly = true)`
- **标准流程**: DTO → Entity → 执行 → Entity → DTO

---

### Step 3: 接口层扩展 (Interface Layer)

#### 3.1 在现有 Controller 中添加方法
**路径**: `interfaces/{Feature}Controller.java`

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserApplicationService userApplicationService;
    
    // 现有方法...
    
    /**
     * 更新用户密码
     * PUT /api/users/{id}/password
     */
    @PutMapping("/{id}/password")
    public ApiResponse<UserResponseDTO> updatePassword(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserPasswordRequestDTO request) {
        try {
            UserResponseDTO user = userApplicationService.updatePassword(id, request);
            return ApiResponse.success(user, "密码更新成功");
        } catch (ResourceNotFoundException e) {
            log.error("用户不存在: userId={}", id);
            return ApiResponse.error(ErrorCode.USER_NOT_FOUND, "用户不存在");
        } catch (Exception e) {
            log.error("更新密码失败: userId={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error(ErrorCode.BAD_REQUEST, "密码更新失败");
        }
    }
    
    /**
     * 搜索用户
     * GET /api/users/search?keyword=xxx&page=0&size=10
     */
    @GetMapping("/search")
    public ApiResponse<Page<UserResponseDTO>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserResponseDTO> users = userApplicationService.searchUsers(keyword, pageable);
            return ApiResponse.success(users, "查询成功");
        } catch (Exception e) {
            log.error("搜索用户失败: keyword={}, error={}", keyword, e.getMessage(), e);
            return ApiResponse.error(ErrorCode.BAD_REQUEST, "搜索失败");
        }
    }
}
```

**Controller职责（仅三件事）**:
1. **解析参数**: 使用 `@PathVariable`, `@RequestParam`, `@RequestBody`
2. **调用 Service**: 调用 `ApplicationService` 执行业务
3. **包装响应**: 返回统一的 `ApiResponse`

**禁止行为**:
- ❌ 在 Controller 中编写业务逻辑（如 if-else 判断）
- ❌ 直接调用 Repository
- ❌ 手动进行 DTO 转换

---

## 完整示例：为 Product 模块添加"批量更新库存"API

### 需求分析
- **业务场景**: 批量更新多个商品的库存数量
- **所属模块**: Product
- **HTTP方法**: PUT
- **请求参数**: `List<{productId, quantity}>`
- **返回数据**: 更新成功的商品列表

### Step 1: 修改 Product Entity
```java
// domain/product/entity/Product.java
@Entity
@Table(name = "products")
@Data
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private BigDecimal price;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity;  // 确保有此字段
    
    // 业务逻辑：更新库存
    public void updateStock(Integer quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("库存数量不能为负数");
        }
        this.stockQuantity = quantity;
    }
}
```

### Step 2: Repository（无需修改）
```java
// domain/product/repository/ProductRepository.java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // findById 已由 JpaRepository 提供
}
```

### Step 3: 创建 Request DTO
```java
// application/dto/request/BatchUpdateStockRequestDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchUpdateStockRequestDTO {
    
    @NotEmpty(message = "更新列表不能为空")
    private List<StockUpdateItem> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockUpdateItem {
        @NotNull(message = "商品ID不能为空")
        private Long productId;
        
        @NotNull(message = "库存数量不能为空")
        @Min(value = 0, message = "库存数量不能为负数")
        private Integer quantity;
    }
}
```

### Step 4: 扩展 Application Service
```java
// application/service/ProductApplicationService.java
@Service
@RequiredArgsConstructor
@Transactional
public class ProductApplicationService {
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    
    public List<ProductResponseDTO> batchUpdateStock(BatchUpdateStockRequestDTO request) {
        List<Product> updatedProducts = new ArrayList<>();
        
        for (var item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "商品不存在: id=" + item.getProductId()));
            
            product.updateStock(item.getQuantity());
            updatedProducts.add(productRepository.save(product));
        }
        
        return updatedProducts.stream()
            .map(productMapper::toResponse)
            .collect(Collectors.toList());
    }
}
```

### Step 5: 添加 Controller 方法
```java
// interfaces/ProductController.java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {
    
    private final ProductApplicationService productApplicationService;
    
    @PutMapping("/stock/batch")
    public ApiResponse<List<ProductResponseDTO>> batchUpdateStock(
            @Valid @RequestBody BatchUpdateStockRequestDTO request) {
        try {
            List<ProductResponseDTO> products = 
                productApplicationService.batchUpdateStock(request);
            return ApiResponse.success(products, "库存更新成功");
        } catch (ResourceNotFoundException e) {
            log.error("商品不存在: {}", e.getMessage());
            return ApiResponse.error(ErrorCode.RESOURCE_NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            log.error("批量更新库存失败: {}", e.getMessage(), e);
            return ApiResponse.error(ErrorCode.BAD_REQUEST, "更新失败");
        }
    }
}
```

---

## 开发自检清单 (Checklist)

使用此清单确保API开发的完整性和规范性：

- [ ] **需求明确**: 是否清楚API的业务场景和数据流？
- [ ] **分层正确**: 
  - [ ] Domain层：是否只包含核心业务逻辑，不依赖上层？
  - [ ] Application层：是否正确编排了业务流程？
  - [ ] Interface层：是否只做参数解析和响应包装？
- [ ] **命名规范**:
  - [ ] RequestDTO：`{Feature}{Action}RequestDTO`
  - [ ] ResponseDTO：`{Feature}ResponseDTO` 或 `{Feature}{场景}ResponseDTO`
  - [ ] Service方法：动词开头（如 `updatePassword`, `searchUsers`）
  - [ ] Controller方法：RESTful风格（如 `PUT /users/{id}/password`）
- [ ] **数据校验**:
  - [ ] RequestDTO是否添加了 `@NotNull`, `@Size`, `@Pattern` 等校验注解？
  - [ ] Controller参数是否添加了 `@Valid` 触发校验？
- [ ] **事务管理**:
  - [ ] 写操作是否标注 `@Transactional`？
  - [ ] 读操作是否标注 `@Transactional(readOnly = true)`？
- [ ] **异常处理**:
  - [ ] 是否捕获了可能的异常（如 `ResourceNotFoundException`）？
  - [ ] 是否返回了合适的错误码和消息？
- [ ] **日志记录**:
  - [ ] 是否在关键操作处添加了 `log.info` 或 `log.error`？
- [ ] **响应格式**:
  - [ ] 是否使用统一的 `ApiResponse` 包装返回结果？
  - [ ] 成功/失败消息是否清晰明确？
- [ ] **代码复用**:
  - [ ] 是否复用了现有的Mapper方法？
  - [ ] 是否避免了重复的业务逻辑？

---

## 常见场景速查

### 场景1：简单的CRUD（无复杂业务逻辑）
**跳过**: Domain Service  
**直接在**: Application Service 中调用 Repository

### 场景2：需要多表关联查询
**方案1**: 在 Repository 中使用 `@Query` 编写 JPQL  
**方案2**: 使用 Specification 动态构建查询条件

### 场景3：需要调用外部服务（如发送邮件）
**位置**: Application Service  
**注意**: 使用独立的 Service 类（如 `EmailService`），不要在 Domain 层调用

### 场景4：需要复杂的权限校验
**方案1**: 使用 Spring Security 的 `@PreAuthorize` 注解  
**方案2**: 在 Application Service 中注入 `SecurityContext` 进行校验

### 场景5：需要分页查询
**推荐方案**: 使用继承 `PageableRequestDTO` 的方式（详见下方"分页查询API开发流程"章节）

**核心要点**：
- ✅ **继承基类**：RequestDTO 继承 `PageableRequestDTO`
- ✅ **JpaSpecificationExecutor**：Repository 需要实现此接口以支持动态查询
- ✅ **Specification模式**：创建 Specification 类构建动态查询条件
- ✅ **一行转换**：Controller中使用 `request.toPageable()` 完成分页转换

**完整实现步骤请参考**：本文档末尾的"[分页查询API开发流程（继承模式）](#分页查询api开发流程继承模式)"章节。

---

## 参考文档

- [新业务开发流程](./Dev-flow.md) - 从零创建新模块
- [API文档示例](./README-BE.md) - 后端API规范
- [通用响应格式](../common/dto/ApiResponse.java) - 统一响应结构

---

## 快速开始模板

### 1. RequestDTO模板
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class {Feature}{Action}RequestDTO {
    
    @NotNull(message = "XXX不能为空")
    private String fieldName;
}
```

### 2. Application Service方法模板
```java
@Transactional
public {Response}DTO {actionName}({Request}DTO request) {
    log.info("{操作描述}: {}", request);
    
    // 1. 查询或创建实体
    {Entity} entity = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("资源不存在"));
    
    // 2. 执行业务逻辑
    entity.doSomething(request.getData());
    
    // 3. 保存并返回
    {Entity} saved = repository.save(entity);
    return mapper.toResponse(saved);
}
```

### 3. Controller方法模板
```java
@{HttpMethod}("{path}")
public ApiResponse<{Response}DTO> {methodName}(
        @Valid @RequestBody {Request}DTO request) {
    try {
        {Response}DTO result = applicationService.{actionName}(request);
        return ApiResponse.success(result, "操作成功");
    } catch ({Specific}Exception e) {
        log.error("操作失败: {}", e.getMessage());
        return ApiResponse.error(ErrorCode.XXX, e.getMessage());
    }
}
```

---

**记住核心原则**: 
1. **Inside-Out**: Domain → Application → Interface
2. **单一职责**: 每层只做自己该做的事
3. **依赖方向**: 只能依赖下层，不能依赖上层
4. **统一规范**: 遵循命名、事务、异常处理的一致性


## 开发自检清单 (Checklist)

- [ ] **分包**: 新文件是否放在了正确的 `domain.{feature}` 包下？
- [ ] **依赖**: 是否确保了 `Domain` 层不依赖 `Application/Interface` 层？
- [ ] **事务**: 写操作（Create/Update/Delete）是否加上了 `@Transactional`？
- [ ] **校验**: RequestDTO 是否有必要的校验注解？
- [ ] **命名**: 是否符合 `Repository`, `Service`, `Controller` 的命名规范？## 分页查询API开发流程（继承模式）

> **🎯 适用场景**：列表查询API（支持可选查询条件 + 分页 + 排序）

### 架构设计原则

本项目使用 **继承模式** 实现分页查询，核心思想：
- **基类 `PageableRequestDTO`**：封装通用分页参数（page, size, sortBy, sortDirection）
- **业务DTO继承基类**：只需定义业务查询条件，自动获得分页能力
- **优势**：代码简洁、URL扁平化、符合RESTful风格

---

### Step 1: Domain层 - 扩展Repository支持动态查询

#### 1.1 Repository继承JpaSpecificationExecutor

**路径**: `domain.{feature}.repository/{Feature}Repository.java`

**修改内容**：
```java
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    // 现有方法保持不变
    Optional<User> findByUsername(String username);
    // ...
}
```

**关键点**：
- ✅ 添加 `JpaSpecificationExecutor<User>` 接口
- ✅ 这样就可以使用 `findAll(Specification<User> spec, Pageable pageable)` 方法

---

#### 1.2 创建Specification类（动态查询条件构建器）

**路径**: `domain.{feature}.specification/{Feature}Specification.java`（新建）

**完整示例**：
```java
package com.night.admin.domain.user.specification;

import com.night.admin.domain.user.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * User 查询规格构建器
 * 用于构建动态查询条件
 */
public class UserSpecification {

    /**
     * 构建用户查询条件
     *
     * @param username 用户名（模糊查询）
     * @param email    邮箱地址（模糊查询）
     * @param isActive 是否激活
     * @return Specification<User>
     */
    public static Specification<User> buildSearchCriteria(String username, String email, Boolean isActive) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 用户名模糊查询（忽略大小写）
            if (username != null && !username.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("username")),
                    "%" + username.toLowerCase() + "%"
                ));
            }

            // 邮箱地址模糊查询（忽略大小写）
            if (email != null && !email.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")),
                    "%" + email.toLowerCase() + "%"
                ));
            }

            // 是否激活精确查询
            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            // 组合所有条件（AND关系）
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

**关键点**：
- ✅ 使用静态方法 `buildSearchCriteria`
- ✅ 参数为可选，只有非空时才添加到查询条件
- ✅ 字符串查询使用 `like` + `lower` 实现模糊匹配且忽略大小写
- ✅ 布尔值查询使用 `equal` 实现精确匹配
- ✅ 使用 `AND` 组合所有条件

---

### Step 2: Application层 - 创建继承分页基类的RequestDTO

#### 2.1 确认分页基类存在

**路径**: `application.dto.request.PageableRequestDTO`

**如果不存在，需要先创建**：
```java
package com.night.admin.application.dto.request;

import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * 分页查询请求基类
 * 适用于所有需要分页的列表查询API
 */
@Data
public class PageableRequestDTO {
    
    private Integer page = 0;                // 页码（从0开始）
    private Integer size = 10;               // 每页大小
    private String sortBy = "createdAt";     // 排序字段
    private String sortDirection = "desc";   // 排序方向（asc/desc）
    
    /**
     * 转换为Spring Data的Pageable对象
     */
    public Pageable toPageable() {
        Sort sort = "asc".equalsIgnoreCase(sortDirection) 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        return PageRequest.of(page, size, sort);
    }
    
    /**
     * 转换为Pageable（自定义默认排序字段）
     */
    public Pageable toPageable(String defaultSortBy) {
        String actualSortBy = (sortBy == null || sortBy.trim().isEmpty()) ? defaultSortBy : sortBy;
        Sort sort = "asc".equalsIgnoreCase(sortDirection) 
            ? Sort.by(actualSortBy).ascending() 
            : Sort.by(actualSortBy).descending();
        return PageRequest.of(page, size, sort);
    }
}
```

---

#### 2.2 创建业务查询DTO（继承基类）

**路径**: `application.dto.request.Search{Feature}RequestDTO`（新建）

**命名规范**: `Search{Feature}RequestDTO`（如 `SearchUserRequestDTO`）

**完整示例**：
```java
package com.night.admin.application.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户查询请求 DTO
 * 
 * 继承 PageableRequestDTO 以支持分页和排序。
 * 所有业务查询条件均为可选。
 * 
 * 使用示例：
 * GET /api/users/search?username=john&isActive=true&page=0&size=10&sortBy=createdAt&sortDirection=desc
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SearchUserRequestDTO extends PageableRequestDTO {
    
    /**
     * 用户名（模糊匹配，忽略大小写）
     */
    private String username;
    
    /**
     * 邮箱地址（模糊匹配，忽略大小写）
     */
    private String email;
    
    /**
     * 是否激活
     * - true: 仅查询激活用户
     * - false: 仅查询未激活用户
     * - null: 查询所有用户
     */
    private Boolean isActive;
}
```

**关键点**：
- ✅ 使用 `@EqualsAndHashCode(callSuper = true)` 确保继承关系正确
- ✅ 只定义业务查询条件，分页参数由基类提供
- ✅ 所有字段均为可选（不添加 `@NotNull` 等注解）
- ✅ 添加详细的Javadoc说明

---

#### 2.3 扩展Application Service（支持Specification查询）

**路径**: `application.service.{Feature}ApplicationService`

**新增方法**：
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserApplicationService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    // 现有方法...
    
    /**
     * 搜索用户（支持可选条件）
     * 
     * @param request 搜索条件（所有字段均为可选）
     * @param pageable 分页参数
     * @return 分页用户列表
     */
    @Transactional(readOnly = true)
    public Page<UserResponseDTO> searchUsers(SearchUserRequestDTO request, Pageable pageable) {
        log.info("搜索用户: username={}, email={}, isActive={}", 
            request.getUsername(), request.getEmail(), request.getIsActive());
        
        // 使用 Specification 构建动态查询条件
        Specification<User> spec = UserSpecification.buildSearchCriteria(
            request.getUsername(), 
            request.getEmail(), 
            request.getIsActive()
        );
        
        // 执行分页查询
        Page<User> users = userRepository.findAll(spec, pageable);
        
        // 转换为 ResponseDTO
        return users.map(userMapper::toResponseDTO);
    }
}
```

**关键点**：
- ✅ 使用 `@Transactional(readOnly = true)` 标记只读事务
- ✅ 调用 Specification 构建查询条件
- ✅ 使用 `repository.findAll(spec, pageable)` 执行查询
- ✅ 使用 `Page.map()` 转换为DTO（保留分页信息）

---

### Step 3: Interface层 - 极简Controller实现

**路径**: `interfaces.{Feature}Controller`

**新增方法**：
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserApplicationService userApplicationService;
    
    /**
     * 搜索用户（支持可选条件和分页）
     * GET /api/users/search?username=xxx&email=xxx&isActive=true&page=0&size=10&sortBy=createdAt&sortDirection=desc
     * 
     * @param request 搜索条件（包含业务查询条件和分页参数）
     * @return 分页用户列表
     */
    @GetMapping("/search")
    public ApiResponse<Page<UserResponseDTO>> searchUsers(
            @ModelAttribute SearchUserRequestDTO request) {
        try {
            // 通过继承的 toPageable() 方法转换为 Pageable
            Pageable pageable = request.toPageable();
            
            // 执行查询
            Page<UserResponseDTO> users = userApplicationService.searchUsers(request, pageable);
            
            log.info("搜索用户成功: 查询条件={}, 结果数={}, 总数={}", 
                request, users.getNumberOfElements(), users.getTotalElements());
            
            return ApiResponse.success(users, "查询成功");
        } catch (Exception e) {
            log.error("搜索用户失败: request={}, error={}", 
                request, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "搜索失败");
        }
    }
}
```

**关键点**：
- ✅ **只有一个参数**：`@ModelAttribute SearchUserRequestDTO request`
- ✅ Spring自动将URL参数绑定到DTO（包括继承的分页字段）
- ✅ 使用 `request.toPageable()` 一行代码完成分页转换
- ✅ Controller只做三件事：解析参数、调用Service、包装响应

---

### 分页查询API使用示例

#### 示例1: 查询所有用户（默认分页）
```bash
GET /api/users/search
# 默认: page=0, size=10, sortBy=createdAt, sortDirection=desc
```

#### 示例2: 按用户名模糊搜索
```bash
GET /api/users/search?username=john
# 匹配: john, John123, johndoe等
```

#### 示例3: 组合条件 + 自定义分页
```bash
GET /api/users/search?username=admin&isActive=true&page=0&size=20&sortBy=username&sortDirection=asc
# 查询用户名包含"admin"且已激活的用户，每页20条，按用户名升序
```

#### 示例4: 邮箱域名筛选
```bash
GET /api/users/search?email=@company.com&isActive=true
# 查询公司邮箱且已激活的用户
```

---

### 响应格式示例

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@company.com",
        "isActive": true,
        "createdAt": "2025-12-26T10:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "orders": [{"property": "createdAt", "direction": "DESC"}]
      }
    },
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  }
}
```

---

### 分页查询开发自检清单

- [ ] **Repository**: 是否继承了 `JpaSpecificationExecutor<Entity>`？
- [ ] **Specification**: 是否创建了 `{Feature}Specification` 类？
- [ ] **RequestDTO**: 是否继承了 `PageableRequestDTO` 并添加 `@EqualsAndHashCode(callSuper = true)`？
- [ ] **Service**: 是否使用 `repository.findAll(spec, pageable)` 执行查询？
- [ ] **Controller**: 是否使用 `@ModelAttribute` 绑定DTO并调用 `request.toPageable()`？
- [ ] **事务**: 是否添加了 `@Transactional(readOnly = true)`？
- [ ] **日志**: 是否记录了查询条件和结果？
- [ ] **编译**: 是否运行 `./gradlew :admin:compileJava` 验证无误？

---

### 🤖 AI生成分页查询API的标准流程

当用户要求"为XX模块添加分页查询API"时，请严格按照以下顺序操作：

1. **修改Repository**：添加 `JpaSpecificationExecutor<Entity>` 接口
2. **创建Specification**：在 `domain.{feature}.specification` 包下创建查询构建器
3. **创建RequestDTO**：继承 `PageableRequestDTO`，只定义业务查询字段
4. **扩展Service**：使用 `repository.findAll(spec, pageable)` 实现查询方法
5. **扩展Controller**：使用 `@ModelAttribute` 接收DTO，调用 `request.toPageable()`
6. **验证编译**：运行 `./gradlew :admin:compileJava`
7. **生成文档**：说明API使用方法和请求参数

---
