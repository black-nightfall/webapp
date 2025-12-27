# ✅ Redis 认证问题最终修复方案

## 问题
```
io.lettuce.core.RedisCommandExecutionException: NOAUTH HELLO must be called with the client already authenticated
```

## 根本原因

Spring Boot Docker Compose 的自动服务连接功能在某些情况下无法正确处理 Redis 密码认证，即使环境变量已设置。

## 最终解决方案

**停止使用 Docker Compose 的自动 Redis 连接，改用手动配置**

### 1. 移除 Redis 的 service-connection label

**docker-compose.yml**
```yaml
redis-dev:
  <<: *redis-common
  profiles: ["dev"]
  # 移除这一行：
  # labels:
  #   - "org.springframework.boot.service-connection=redis"
  container_name: ${CONTAINER_PREFIX:-webapp}_redis_dev
  ports:
    - "6379:6379"
```

### 2. 在 application.yaml 中显式配置 Redis

**application.yaml**
```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: changeme  # 显式设置密码
      database: 0
      timeout: 3000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 2
      client-type: lettuce
      connect-timeout: 10000ms
```

## 工作原理

1. **PostgreSQL**: 继续使用 Docker Compose 自动连接（有 service-connection label）
2. **Redis**: 使用手动配置（无 service-connection label）

这样可以避免自动配置与手动配置的冲突。

## 验证

Redis 容器正常运行：
```bash
$ docker ps | grep redis
webapp_redis_dev   0.0.0.0:6379->6379/tcp

$ docker exec webapp_redis_dev redis-cli -a changeme PING  
PONG ✅
```

## 下一步

**重启后端应用**，现在应该能正常连接 Redis 了。

Spring Boot 会：
1. 自动连接 PostgreSQL（通过 Docker Compose）
2. 手动连接 Redis（使用 application.yaml 中的配置）

---

**如果还是报错，请检查**：
1. Redis 容器是否在运行：`docker ps | grep redis`
2. 后端应用日志中的 Redis 连接信息
3. 环境变量是否正确设置
