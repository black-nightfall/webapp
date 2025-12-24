# API 响应示例文档

## 概述

本文档展示了如何在 API 中使用 `ApiResponse` 统一响应格式。包含 admin 模块和 website 模块的完整示例。

---

## Admin 模块 API 示例 (Spring Web MVC + Java)

### 1. 成功响应（带数据）

**请求**:
```bash
GET /api/users/1
```

**响应** (200 OK):
```json
{
  "success": true,
  "code": "0",
  "message": "用户查询成功",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 2. 成功响应（无数据）

**请求**:
```bash
POST /api/users
Content-Type: application/json

{
  "name": "李四",
  "email": "lisi@example.com"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "code": "0",
  "message": "用户创建成功",
  "data": null,
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 3. 错误响应（资源不存在）

**请求**:
```bash
DELETE /api/users/999
```

**响应** (200 OK):
```json
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "用户ID: 999 不存在",
  "data": null,
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 4. 错误响应（参数验证失败）

**请求**:
```bash
POST /api/users
Content-Type: application/json

{
  "name": "",
  "email": "invalid-email"
}
```

**响应** (200 OK):
```json
{
  "success": false,
  "code": "INVALID_ARGUMENT",
  "message": "用户名不能为空",
  "data": null,
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 5. 错误响应（自定义错误码）

**请求**:
```bash
PUT /api/users/1
Content-Type: application/json

{
  "name": "王五",
  "email": "invalid-email"
}
```

**响应** (200 OK):
```json
{
  "success": false,
  "code": "INVALID_EMAIL",
  "message": "邮箱格式不正确",
  "data": null,
  "timestamp": "2025-12-24T15:30:45"
}
```

---

## Website 模块 API 示例 (Spring WebFlux + Kotlin)

### 1. 成功响应（带数据）- 响应式

**请求**:
```bash
GET /api/articles/1
```

**响应** (200 OK):
```json
{
  "success": true,
  "code": "0",
  "message": "文章查询成功",
  "data": {
    "id": 1,
    "title": "Spring Boot 最佳实践",
    "content": "这是一篇关于 Spring Boot 的文章...",
    "author": "张三",
    "views": 1000
  },
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 2. 成功响应（无数据）- 响应式

**请求**:
```bash
POST /api/articles
Content-Type: application/json

{
  "title": "Kotlin 协程指南",
  "content": "这是一篇关于 Kotlin 协程的文章...",
  "author": "李四"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "code": "0",
  "message": "文章创建成功",
  "data": 1703424645000,
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 3. 分页响应示例

**请求**:
```bash
GET /api/articles?pageNo=1&pageSize=10
```

**响应** (200 OK):
```json
{
  "success": true,
  "code": "0",
  "message": "文章列表查询成功",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Spring Boot 最佳实践",
        "content": "内容...",
        "author": "张三",
        "views": 1000
      },
      {
        "id": 2,
        "title": "Kotlin 协程指南",
        "content": "内容...",
        "author": "李四",
        "views": 800
      },
      {
        "id": 3,
        "title": "WebFlux 响应式编程",
        "content": "内容...",
        "author": "王五",
        "views": 600
      }
    ],
    "pageNo": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 4. 错误响应（资源不存在）

**请求**:
```bash
DELETE /api/articles/999
```

**响应** (200 OK):
```json
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "文章ID: 999 不存在",
  "data": null,
  "timestamp": "2025-12-24T15:30:45"
}
```

---

### 5. 流式搜索响应

**请求**:
```bash
GET /api/articles/search?keyword=Spring
```

**响应** (200 OK - 流式内容):
```
<stream>
{"id":1,"title":"Spring Boot 最佳实践","content":"内容...","author":"张三","views":1000}
{"id":2,"title":"Spring Cloud 微服务","content":"内容...","author":"李四","views":800}
{"id":3,"title":"Spring Security 安全","content":"内容...","author":"王五","views":600}
</stream>
```

---

### 6. 使用扩展函数的响应

**请求**:
```bash
PUT /api/articles/1/views
```

**响应** (200 OK):
```json
{
  "success": true,
  "code": "0",
  "message": "浏览量更新成功",
  "data": {
    "id": 1,
    "title": "Spring Boot 最佳实践",
    "content": "这是一篇关于 Spring Boot 的文章...",
    "author": "张三",
    "views": 1001
  },
  "timestamp": "2025-12-24T15:30:45"
}
```

---

## 代码使用示例

### Admin 模块 (Java)

```java
// 1. 成功响应（带数据）
return ApiResponse.success(user, "用户查询成功");

// 2. 成功响应（无数据）
return ApiResponse.success("用户创建成功");

// 3. 错误响应
throw new ResourceNotFoundException("用户不存在");

// 4. 自定义错误码
return ApiResponse.error("INVALID_EMAIL", "邮箱格式不正确");
```

### Website 模块 (Kotlin)

```kotlin
// 1. 在 Mono 中使用
return Mono.fromCallable {
    ApiResponse.success(article, "文章查询成功")
}

// 2. 使用扩展函数
article.toSuccessResponse("浏览量更新成功")

// 3. 分页响应
val pageResponse = PageResponse.of(articles, pageNo, pageSize, total)
ApiResponse.success(pageResponse, "列表查询成功")

// 4. 抛出异常（由全局异常处理器转换为错误响应）
throw ResourceNotFoundException("文章不存在")
```

---

## 响应状态码说明

| 状态码 | 含义 | 示例 |
|--------|------|------|
| 200 OK | 请求成功（无论业务成功或失败） | 所有正常请求 |
| 400 Bad Request | 请求参数格式错误 | 无效的 JSON 格式 |
| 401 Unauthorized | 未授权 | 缺少认证信息 |
| 403 Forbidden | 禁止访问 | 权限不足 |
| 404 Not Found | 资源不存在 | 错误的 API 路径 |
| 500 Internal Server Error | 服务器内部错误 | 未捕获的异常 |

---

## ApiResponse 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| success | Boolean | 业务是否成功（true/false） |
| code | String | 业务状态码（"0" 表示成功） |
| message | String | 业务提示消息 |
| data | T | 业务数据（可为 null） |
| timestamp | LocalDateTime | 响应时间戳 |

---

## 使用建议

1. **统一格式** - 所有 API 都使用 `ApiResponse` 统一响应格式
2. **异常捕获** - 业务异常由全局异常处理器转换为 `ApiResponse`
3. **错误码定义** - 使用 `ErrorCodeConstant` 中的常量定义错误码
4. **分页响应** - 列表接口使用 `PageResponse` 返回分页数据
5. **扩展函数** - 利用 `common` 模块的扩展函数简化代码

---

## 常见问题

### Q: 如何在 admin 模块中使用 ApiResponse？
A: admin 使用 Spring Web，直接在控制器中返回 `ApiResponse<T>`，Spring 会自动序列化为 JSON。

### Q: 如何在 website 模块中使用 ApiResponse？
A: website 使用 WebFlux，需要包装在 `Mono<ApiResponse<T>>` 或 `Flux<T>` 中进行响应式处理。

### Q: 如何处理异常并转换为错误响应？
A: 在全局异常处理器中捕获异常，返回 `ApiResponse.error()` 或抛出 `ApplicationException` 的子类。

### Q: 分页响应如何使用？
A: 使用 `PageResponse.of()` 工厂方法构建分页响应，包含在 `ApiResponse` 中返回。

---

更新时间: 2025-12-24

