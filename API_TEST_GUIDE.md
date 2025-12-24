# API 测试指南

本文档提供了如何测试 admin 和 website 模块的 API 的详细说明。

## 环境准备

### 启动应用

**启动 Admin 模块**:
```bash
cd /Users/peigen/Documents/dev/peigen/webapp
./gradlew :admin:bootRun
```

Admin 服务将在 `http://localhost:8080` 启动

**启动 Website 模块**:
```bash
cd /Users/peigen/Documents/dev/peigen/webapp
./gradlew :website:bootRun
```

Website 服务将在 `http://localhost:8081` 启动（需要配置不同的端口）

---

## Admin 模块 API 测试 (Spring Web MVC)

### 1. 获取用户 - 成功响应

**使用 cURL**:
```bash
curl -X GET "http://localhost:8080/api/users/1" \
  -H "Content-Type: application/json"
```

**使用 Postman**:
- 方法: `GET`
- URL: `http://localhost:8080/api/users/1`
- 预期响应: 200 OK

**预期结果**:
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

### 2. 创建用户 - 成功响应（无数据）

**使用 cURL**:
```bash
curl -X POST "http://localhost:8080/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "李四",
    "email": "lisi@example.com"
  }'
```

**使用 Postman**:
- 方法: `POST`
- URL: `http://localhost:8080/api/users`
- Body (JSON):
  ```json
  {
    "name": "李四",
    "email": "lisi@example.com"
  }
  ```

**预期结果**:
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

### 3. 创建用户 - 参数验证失败

**使用 cURL**:
```bash
curl -X POST "http://localhost:8080/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid"
  }'
```

**预期结果**:
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

### 4. 删除用户 - 资源不存在

**使用 cURL**:
```bash
curl -X DELETE "http://localhost:8080/api/users/999" \
  -H "Content-Type: application/json"
```

**预期结果**:
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

### 5. 更新用户 - 自定义错误码

**使用 cURL**:
```bash
curl -X PUT "http://localhost:8080/api/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "王五",
    "email": "invalid-email"
  }'
```

**预期结果**:
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

## Website 模块 API 测试 (Spring WebFlux)

### 1. 获取文章 - 成功响应

**使用 cURL**:
```bash
curl -X GET "http://localhost:8081/api/articles/1" \
  -H "Content-Type: application/json"
```

**预期结果**:
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

### 2. 创建文章 - 成功响应（无数据）

**使用 cURL**:
```bash
curl -X POST "http://localhost:8081/api/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kotlin 协程指南",
    "content": "这是一篇关于 Kotlin 协程的文章...",
    "author": "李四"
  }'
```

**预期结果**:
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

### 3. 获取文章列表 - 分页响应

**使用 cURL**:
```bash
curl -X GET "http://localhost:8081/api/articles?pageNo=1&pageSize=10" \
  -H "Content-Type: application/json"
```

**预期结果**:
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

### 4. 删除文章 - 资源不存在

**使用 cURL**:
```bash
curl -X DELETE "http://localhost:8081/api/articles/999" \
  -H "Content-Type: application/json"
```

**预期结果**:
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

### 5. 搜索文章 - 流式响应

**使用 cURL**:
```bash
curl -X GET "http://localhost:8081/api/articles/search?keyword=Spring" \
  -H "Content-Type: application/json"
```

**预期结果** (流式):
```
{"id":1,"title":"Spring Boot 最佳实践","content":"内容...","author":"张三","views":1000}
{"id":2,"title":"Spring Cloud 微服务","content":"内容...","author":"李四","views":800}
{"id":3,"title":"Spring Security 安全","content":"内容...","author":"王五","views":600}
```

---

### 6. 更新文章浏览量 - 使用扩展函数

**使用 cURL**:
```bash
curl -X PUT "http://localhost:8081/api/articles/1/views" \
  -H "Content-Type: application/json"
```

**预期结果**:
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

## 使用 Postman 集合进行批量测试

### 导入集合

将以下 JSON 保存为 `API_Tests.postman_collection.json`，导入到 Postman 中：

```json
{
  "info": {
    "name": "WebApp API Tests",
    "description": "Admin 和 Website 模块的 API 测试集合"
  },
  "item": [
    {
      "name": "Admin - 获取用户",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/users/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "users", "1"]
        }
      }
    },
    {
      "name": "Admin - 创建用户",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"李四\", \"email\": \"lisi@example.com\"}"
        },
        "url": {
          "raw": "http://localhost:8080/api/users",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Website - 获取文章",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8081/api/articles/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8081",
          "path": ["api", "articles", "1"]
        }
      }
    },
    {
      "name": "Website - 获取文章列表",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8081/api/articles?pageNo=1&pageSize=10",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8081",
          "path": ["api", "articles"],
          "query": [
            {"key": "pageNo", "value": "1"},
            {"key": "pageSize", "value": "10"}
          ]
        }
      }
    }
  ]
}
```

---

## 测试清单

### Admin 模块测试清单

- [ ] 获取用户（成功）
- [ ] 创建用户（成功）
- [ ] 创建用户（参数验证失败）
- [ ] 删除用户（资源不存在）
- [ ] 更新用户（自定义错误码）

### Website 模块测试清单

- [ ] 获取文章（成功）
- [ ] 创建文章（成功）
- [ ] 获取文章列表（分页）
- [ ] 删除文章（资源不存在）
- [ ] 搜索文章（流式）
- [ ] 更新浏览量（扩展函数）

---

## 常见问题

### Q: 如何修改应用端口？
A: 修改 `src/main/resources/application.yaml` 中的 `server.port` 配置。

### Q: 如何调试响应式代码？
A: 使用 `Mono.doOnNext()` 和 `Flux.doOnNext()` 添加日志记录。

### Q: 如何处理异常并查看完整堆栈？
A: 启用调试日志：
```yaml
logging:
  level:
    com.night: DEBUG
```

### Q: 如何在本地环境中测试所有 API？
A: 使用提供的测试脚本或导入 Postman 集合。

---

更新时间: 2025-12-24

