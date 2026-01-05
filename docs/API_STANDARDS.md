# API 统一规范

> 项目API设计的统一标准和最佳实践

## 📋 目录

- [RESTful 路径设计](#restful-路径设计)
- [统一响应格式](#统一响应格式)
- [分页规范](#分页规范)
- [错误处理](#错误处理)
- [日期时间格式](#日期时间格式)
- [参数校验](#参数校验)

---

## RESTful 路径设计

### 路径前缀

| 模块 | Context Path | 说明 |
|------|--------------|------|
| **Admin Backend** | `/admin` | 管理后台API |
| **Website Backend** | `/` (无前缀) | 用户网站API |

### 资源命名规则

```
✅ 正确:
  GET  /admin/users          # 复数名词
  POST /admin/users
  GET  /admin/users/123
  PUT  /admin/users/123

❌ 错误:
  GET  /admin/getUsers       # 不要动词
  POST /admin/createUser     # 不要动词
  GET  /admin/user/123       # 使用复数
```

### HTTP方法语义

| 方法 | 用途 | 是否幂等 | 示例 |
|------|------|---------|------|
| **GET** | 查询资源 | ✅ | `GET /users` |
| **POST** | 创建资源 | ❌ | `POST /users` |
| **PUT** | 完整更新 | ✅ | `PUT /users/123` |
| **PATCH** | 部分更新 | ✅ | `PATCH /users/123` |
| **DELETE** | 删除资源 | ✅ | `DELETE /users/123` |

### 嵌套资源

```
✅ 推荐:
  GET /users/123/orders      # 用户的订单
  GET /roles/5/permissions   # 角色的权限

⚠️ 避免过深嵌套:
  ❌ /users/123/orders/456/items/789
  ✅ /order-items/789
```

---

## 统一响应格式

### 成功响应

**格式**:
```json
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "操作成功",
  "code": 200
}
```

**示例**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "message": "获取用户成功",
  "code": 200
}
```

### 错误响应

**格式**:
```json
{
  "success": false,
  "data": null,
  "message": "错误描述",
  "code": 400
}
```

**示例**:
```json
{
  "success": false,
  "data": null,
  "message": "用户名已存在",
  "code": 400
}
```

### TypeScript类型定义

```typescript
// Admin/Website通用
interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
    code: number;
}

// 使用示例
type UserResponse = ApiResponse<User>;
type UsersResponse = ApiResponse<User[]>;
```

---

## 分页规范

### 请求参数

**统一参数名**:
```
page: number        # 页码（0-indexed, 后端）
size: number        # 每页数量
sortBy: string      # 排序字段
sortDirection: string  # ASC | DESC
```

**示例请求**:
```bash
GET /admin/users?page=0&size=10&sortBy=createdAt&sortDirection=DESC
```

### 响应格式（Spring Data Page）

```json
{
  "success": true,
  "data": {
    "content": [
      { "id": 1, "username": "user1" },
      { "id": 2, "username": "user2" }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0,        # 当前页码（0-indexed）
    "first": true,
    "last": false,
    "empty": false
  }
}
```

### TypeScript类型定义

```typescript
interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;  // 当前页（0-indexed）
    first: boolean;
    last: boolean;
    empty: boolean;
}
```

### 前端分页处理

**Ant Design (1-indexed)**:
```typescript
// 后端0-indexed → 前端1-indexed
<Table
    pagination={{
        current: data.number + 1,
        pageSize: data.size,
        total: data.totalElements,
    }}
    onChange={(pagination) => {
        fetchData({ page: (pagination.current || 1) - 1 });
    }}
/>
```

---

## 错误处理

### HTTP状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|---------|
| **200** | OK | 成功 |
| **201** | Created | 创建成功 |
| **400** | Bad Request | 参数错误 |
| **401** | Unauthorized | 未认证 |
| **403** | Forbidden | 无权限 |
| **404** | Not Found | 资源不存在 |
| **409** | Conflict | 资源冲突 |
| **500** | Internal Server Error | 服务器错误 |

### 错误码定义

**格式**: `模块_错误类型_编号`

```typescript
// 通用错误 (1000-1999)
INVALID_PARAMETER = 1001
UNAUTHORIZED = 1002
FORBIDDEN = 1003
NOT_FOUND = 1004

// 用户模块 (2000-2999)
USER_NOT_FOUND = 2001
USER_ALREADY_EXISTS = 2002
USER_PASSWORD_INCORRECT = 2003

// 订单模块 (3000-3999)
ORDER_NOT_FOUND = 3001
ORDER_CANNOT_CANCEL = 3002
```

### 错误响应示例

**参数验证错误**:
```json
{
  "success": false,
  "data": null,
  "message": "用户名不能为空",
  "code": 1001
}
```

**业务逻辑错误**:
```json
{
  "success": false,
  "data": null,
  "message": "用户名已存在",
  "code": 2002
}
```

---

## 日期时间格式

### 统一使用ISO 8601

**格式**: `yyyy-MM-dd'T'HH:mm:ss'Z'`

**示例**:
```json
{
  "createdAt": "2024-01-15T08:30:45Z",
  "updatedAt": "2024-01-16T14:20:00Z"
}
```

### 后端实现

**Java (Jackson)**:
```java
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
private LocalDateTime createdAt;
```

**Kotlin (Jackson)**:
```kotlin
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
val createdAt: LocalDateTime
```

### 前端处理

**TypeScript**:
```typescript
interface User {
    id: number;
    username: string;
    createdAt: string;  // ISO 8601字符串
}

// 显示时转换
const displayDate = new Date(user.createdAt).toLocaleString();
```

**禁止使用Date类型**:
```typescript
// ❌ 错误
interface User {
    createdAt: Date;  // JSON序列化问题
}

// ✅ 正确
interface User {
    createdAt: string;  // ISO 8601字符串
}
```

---

## 参数校验

### Bean Validation (后端)

**常用注解**:
```java
public class CreateUserRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度3-50")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码至少6位")
    private String password;
    
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @DecimalMin(value = "0.01", message = "价格必须大于0")
    private BigDecimal price;
}
```

**Controller使用**:
```java
@PostMapping
public ApiResponse<User> createUser(
    @Valid @RequestBody CreateUserRequest request
) {
    // 自动校验，失败抛出MethodArgumentNotValidException
}
```

### 前端校验

**Ant Design Form**:
```typescript
<Form.Item
    name="username"
    rules={[
        { required: true, message: '用户名不能为空' },
        { min: 3, max: 50, message: '用户名长度3-50' },
    ]}
>
    <Input />
</Form.Item>
```

---

## 查询参数规范

### 搜索过滤

**命名规则**:
```
✅ 正确:
  ?username=john           # 精确匹配
  ?username__like=john     # 模糊查询
  ?price__gte=100          # 大于等于
  ?price__lte=500          # 小于等于
  ?status__in=ACTIVE,PENDING  # IN查询

❌ 避免:
  ?search=john             # 不明确
  ?filter=something        # 不明确
```

### 排序

```
?sortBy=createdAt&sortDirection=DESC
?sortBy=price&sortDirection=ASC
```

### 示例

```bash
# 搜索用户名包含"john"，状态为ACTIVE，按创建时间降序
GET /admin/users?username__like=john&status=ACTIVE&sortBy=createdAt&sortDirection=DESC&page=0&size=10
```

---

## 最佳实践

### ✅ 推荐

1. **使用复数名词**: `/users` 而非 `/user`
2. **返回完整对象**: POST/PUT返回创建/更新后的完整对象
3. **幂等性**: PUT/DELETE必须保证幂等
4. **版本控制**: 通过URL版本化 `/v1/users` 或 Header `Accept: application/vnd.api.v1+json`

### ❌ 避免

1. **动词作为路径**: `/getUser` `/createUser`
2. **过深嵌套**: 超过3层
3. **混用约定**: 同时用camelCase和snake_case
4. **返回HTML**: API只返回JSON

---

**统一规范，提升开发效率！** 📋
