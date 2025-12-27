# ✅ Spring Boot Docker Compose 测试环境自动启动

## 🎉 配置完成

现在运行测试时，Docker 容器会**自动启动**！

## 🔧 关键修改

### 1. build.gradle.kts
添加了测试依赖：

```kotlin
// Docker Compose Support (开发和测试环境)
developmentOnly(libs.springBootDockerCompose)
testImplementation(libs.springBootDockerCompose)  // ← 新增
```

### 2. application-test.yaml
测试专用配置，自动使用测试环境：

```yaml
spring:
  docker:
    compose:
      enabled: true
      file: ./infra/docker/docker-compose.yml
      env:  # 测试环境的环境变量
        ENV: test
        POSTGRES_PORT: "5433"
        POSTGRES_DB: appdb_test
        # ...
```

### 3. docker-compose.yml
添加了服务标签：

```yaml
services:
  db:
    labels:
      - "org.springframework.boot.service-connection=postgres"
  redis:
    labels:
      - "org.springframework.boot.service-connection=redis"
```

## 🧪 使用方法

### 在 IntelliJ IDEA 中运行测试

1. **打开测试类** (如 `PasswordUtilTest.java`)
2. **点击绿色箭头** ▶️
3. **自动发生**：
   - Spring Boot 读取 `application-test.yaml`
   - 使用测试环境变量启动 Docker 容器
   - 容器名：`webapp_postgres_test`, `webapp_redis_test`
   - 端口：5433, 6380
   - 等待容器健康检查
   - 运行测试

### 控制台输出

```
Docker Compose services found: [db, redis, flyway]
Starting Docker Compose services...
Container webapp_postgres_test  Starting
Container webapp_redis_test  Starting
Container webapp_postgres_test  Healthy ✅
Container webapp_redis_test  Healthy ✅
```

## 📊 环境对比

| 环境 | 触发方式 | 容器名 | PostgreSQL | Redis |
|------|----------|--------|-----------|-------|
| **开发** | `bootRun` | `webapp_*_dev` | `localhost:5432/appdb` | `localhost:6379` |
| **测试** | 运行测试 | `webapp_*_test` | `localhost:5433/appdb_test` | `localhost:6380` |

## ✨ 优势

1. ✅ **完全自动**：无需手动启动容器
2. ✅ **环境隔离**：测试和开发使用不同容器
3. ✅ **一键运行**：点击绿色箭头，一切自动完成
4. ✅ **新人友好**：clone 代码后直接运行测试

## 🔍 验证

运行测试后，检查容器：

```bash
docker ps | grep webapp_postgres_test
```

应该看到：
```
webapp_postgres_test   Up (healthy)   0.0.0.0:5433->5432/tcp
```

## 📝 工作流程

### 开发流程
```bash
# 运行应用
./gradlew :admin:bootRun
# → 自动启动 webapp_*_dev 容器（端口 5432, 6379）
```

### 测试流程
```bash
# 在 IDEA 中点击绿色箭头
# → 自动启动 webapp_*_test 容器（端口 5433, 6380）
# → 运行测试
# → 测试完成
```

## 🎯 下一步

现在你可以：
1. ✅ 直接在 IDEA 中运行任何测试
2. ✅ 容器自动启动，无需任何手动操作
3. ✅ 专注于编写代码和测试

试试运行 `PasswordUtilTest` 吧！✨
