# 用户搜索 API 开发总结

## 📋 需求
创建一个查询用户的 API，支持以下可选条件：
1. 用户名（模糊匹配）
2. 邮箱地址（模糊匹配）
3. 用户是否有效（精确匹配）

## 🏗️ 实现架构（Inside-Out）

### Step 1: Domain Layer（领域层）

#### 1.1 扩展 UserRepository
**文件**: `domain/user/repository/UserRepository.java`

新增 `JpaSpecificationExecutor` 接口支持动态查询：
```java
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    // ... existing methods
}
```

#### 1.2 创建 UserSpecification
**文件**: `domain/user/specification/UserSpecification.java`（新建）

使用 JPA Criteria API 构建动态查询条件：
```java
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
        
        // 邮箱模糊查询（忽略大小写）
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
        
        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
}
```

---

### Step 2: Application Layer（应用层）

#### 2.1 创建 SearchUserRequestDTO
**文件**: `application/dto/request/SearchUserRequestDTO.java`（新建）

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchUserRequestDTO {
    private String username;   // 可选：用户名模糊匹配
    private String email;      // 可选：邮箱模糊匹配
    private Boolean isActive;  // 可选：是否激活（true/false/null）
}
```

#### 2.2 扩展 UserApplicationService
**文件**: `application/service/UserApplicationService.java`

新增两个重载方法：
```java
// 方法1：支持分页
@Transactional(readOnly = true)
public Page<UserResponseDTO> searchUsers(SearchUserRequestDTO request, Pageable pageable) {
    Specification<User> spec = UserSpecification.buildSearchCriteria(
        request.getUsername(), 
        request.getEmail(), 
        request.getIsActive()
    );
    Page<User> users = userRepository.findAll(spec, pageable);
    return users.map(userMapper::toResponseDTO);
}

// 方法2：不分页（返回所有匹配结果）
@Transactional(readOnly = true)
public List<UserResponseDTO> searchUsers(SearchUserRequestDTO request) {
    Specification<User> spec = UserSpecification.buildSearchCriteria(
        request.getUsername(), 
        request.getEmail(), 
        request.getIsActive()
    );
    List<User> users = userRepository.findAll(spec);
    return users.stream()
        .map(userMapper::toResponseDTO)
        .collect(Collectors.toList());
}
```

---

### Step 3: Interface Layer（接口层）

#### 3.1 扩展 UserController
**文件**: `interfaces/UserController.java`

新增搜索端点：
```java
@GetMapping("/search")
public ApiResponse<Page<UserResponseDTO>> searchUsers(
        @RequestParam(required = false) String username,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) Boolean isActive,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDirection) {
    // ... implementation
}
```

---

## 🚀 API 使用示例

### 端点信息
- **URL**: `GET /api/users/search`
- **Content-Type**: `application/json`

### 请求参数（全部可选）

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `username` | String | 否 | - | 用户名（模糊匹配，忽略大小写） |
| `email` | String | 否 | - | 邮箱地址（模糊匹配，忽略大小写） |
| `isActive` | Boolean | 否 | - | 是否激活（true/false） |
| `page` | Integer | 否 | 0 | 页码（从0开始） |
| `size` | Integer | 否 | 10 | 每页大小 |
| `sortBy` | String | 否 | createdAt | 排序字段（如：username, email, createdAt） |
| `sortDirection` | String | 否 | desc | 排序方向（asc/desc） |

### 示例 1: 查询所有用户（默认分页）
```bash
GET /api/users/search
```

### 示例 2: 按用户名模糊搜索
```bash
GET /api/users/search?username=john
```
**匹配**: john, John123, johndoe 等

### 示例 3: 按邮箱模糊搜索
```bash
GET /api/users/search?email=@gmail.com
```
**匹配**: 所有 Gmail 邮箱用户

### 示例 4: 查询激活用户
```bash
GET /api/users/search?isActive=true
```

### 示例 5: 组合条件查询
```bash
GET /api/users/search?username=admin&isActive=true&page=0&size=20
```
**说明**: 查询用户名包含 "admin" 且已激活的用户，每页20条

### 示例 6: 自定义排序
```bash
GET /api/users/search?sortBy=username&sortDirection=asc
```
**说明**: 按用户名升序排列

### 示例 7: 多条件组合（实际应用）
```bash
GET /api/users/search?email=@company.com&isActive=true&page=0&size=10&sortBy=createdAt&sortDirection=desc
```
**说明**: 查询公司邮箱且已激活的用户，按创建时间倒序

---

## 📦 响应格式

### 成功响应
```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "content": [
      {
        "id": 1,
        "uid": "123e4567-e89b-12d3-a456-426614174000",
        "username": "admin",
        "email": "admin@example.com",
        "fullName": "Administrator",
        "isActive": true,
        "createdAt": "2025-12-26T10:00:00",
        "updatedAt": "2025-12-26T10:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "orders": [
          {
            "property": "createdAt",
            "direction": "DESC"
          }
        ]
      }
    },
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "numberOfElements": 1,
    "first": true,
    "last": true,
    "empty": false
  }
}
```

### 失败响应
```json
{
  "success": false,
  "code": 400,
  "message": "搜索失败",
  "data": null
}
```

---

## ✅ 开发自检清单

- [x] **分包**: 代码按照 DDD 分层结构正确放置
  - [x] `domain/user/specification/UserSpecification.java`
  - [x] `application/dto/request/SearchUserRequestDTO.java`
  - [x] `application/service/UserApplicationService.java`
  - [x] `interfaces/UserController.java`
  
- [x] **依赖**: Domain 层不依赖 Application/Interface 层
  
- [x] **事务**: 查询操作使用 `@Transactional(readOnly = true)`
  
- [x] **校验**: 请求参数均为可选，无需校验注解
  
- [x] **命名**: 符合命名规范
  - [x] RequestDTO: `SearchUserRequestDTO`
  - [x] Service方法: `searchUsers`
  - [x] Controller端点: `GET /search`
  
- [x] **代码复用**: 复用现有 `UserResponseDTO` 和 `UserMapper`
  
- [x] **日志记录**: 添加了查询日志和错误日志
  
- [x] **编译通过**: ✅ Gradle 编译成功

---

## 🎯 技术要点

### 1. JPA Specification 的优势
- ✅ **类型安全**: 编译时检查，避免拼写错误
- ✅ **动态查询**: 根据条件动态组合 WHERE 子句
- ✅ **可复用**: Specification 可以组合、复用
- ✅ **性能优化**: JPA 自动优化 SQL

### 2. 可选条件的实现
```java
if (username != null && !username.trim().isEmpty()) {
    predicates.add(criteriaBuilder.like(...));
}
```
**关键**: 只有当参数非空时才添加查询条件

### 3. 模糊查询 + 大小写不敏感
```java
criteriaBuilder.like(
    criteriaBuilder.lower(root.get("username")),
    "%" + username.toLowerCase() + "%"
)
```
**效果**: `john` 可以匹配 `John`, `JOHN`, `johndoe` 等

### 4. 分页 + 排序
```java
Sort sort = Sort.by(sortBy).descending();
Pageable pageable = PageRequest.of(page, size, sort);
```
**Spring Data JPA 自动处理 LIMIT、OFFSET 和 ORDER BY**

---

## 📚 相关文件清单

### 新建文件
1. [UserSpecification.java](file:///Users/peigen/Documents/dev/peigen/webapp/admin/src/main/java/com/night/admin/domain/user/specification/UserSpecification.java)
2. [SearchUserRequestDTO.java](file:///Users/peigen/Documents/dev/peigen/webapp/admin/src/main/java/com/night/admin/application/dto/request/SearchUserRequestDTO.java)

### 修改文件
1. [UserRepository.java](file:///Users/peigen/Documents/dev/peigen/webapp/admin/src/main/java/com/night/admin/domain/user/repository/UserRepository.java) - 新增 `JpaSpecificationExecutor`
2. [UserApplicationService.java](file:///Users/peigen/Documents/dev/peigen/webapp/admin/src/main/java/com/night/admin/application/service/UserApplicationService.java) - 新增 `searchUsers` 方法
3. [UserController.java](file:///Users/peigen/Documents/dev/peigen/webapp/admin/src/main/java/com/night/admin/interfaces/UserController.java) - 新增 `/search` 端点

---

## 🧪 测试建议

### 1. 单元测试（可选）
```java
@Test
void testSearchUsersByUsername() {
    SearchUserRequestDTO request = new SearchUserRequestDTO();
    request.setUsername("john");
    
    Pageable pageable = PageRequest.of(0, 10);
    Page<UserResponseDTO> result = userApplicationService.searchUsers(request, pageable);
    
    assertNotNull(result);
    assertTrue(result.getContent().stream()
        .allMatch(u -> u.getUsername().toLowerCase().contains("john")));
}
```

### 2. 集成测试（使用 Postman/curl）
```bash
# 启动应用后测试
curl -X GET "http://localhost:8080/api/users/search?username=admin&isActive=true"
```

---

## 💡 扩展建议

如需进一步增强，可以考虑：

1. **添加日期范围查询**
   ```java
   private LocalDateTime createdAfter;
   private LocalDateTime createdBefore;
   ```

2. **支持多字段排序**
   ```java
   Sort sort = Sort.by(
       Sort.Order.desc("isActive"),
       Sort.Order.asc("username")
   );
   ```

3. **导出功能**（不分页，导出所有匹配结果为 CSV/Excel）
   ```java
   @GetMapping("/search/export")
   public List<UserResponseDTO> exportUsers(SearchUserRequestDTO request) {
       return userApplicationService.searchUsers(request); // 不分页版本
   }
   ```

---

**开发完成！** ✅ 所有代码已编译通过，可以启动应用进行测试。
