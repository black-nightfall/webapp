# 🚀 快速开始指南

## 前置要求
- Docker 和 Docker Compose 已安装
- JDK 17+
- Gradle 8.0+

## 第一次运行

### 1. 启动开发环境

```bash
# 进入 Docker 目录
cd infra/docker

# 启动开发环境容器
./start-dev.sh

# 等待容器完全启动（约 10 秒）
```

### 2. 运行应用

```bash
# 返回项目根目录
cd ../..

# 运行应用（开发模式）
./gradlew :admin:bootRun

# 或者使用环境变量方式
export SPRING_PROFILES_ACTIVE=dev
./gradlew :admin:bootRun
```

### 3. 测试应用

访问: `http://localhost:9090/admin`

默认管理员账户:
- 用户名: `admin`
- 密码: `admin123`

## 运行测试

### 1. 启动测试环境

```bash
# 进入 Docker 目录
cd infra/docker

# 启动测试环境容器（使用不同的端口，不会与开发环境冲突）
./start-test.sh
```

### 2. 执行测试

```bash
# 返回项目根目录
cd ../..

# 运行所有测试
./gradlew :admin:test

# 运行特定测试
./gradlew :admin:test --tests "com.night.admin.util.PasswordUtilTest"
```

## 环境管理

### 查看运行中的容器

```bash
docker ps
```

你应该看到类似这样的输出：

```
CONTAINER ID   IMAGE           STATUS         PORTS                    NAMES
abc123...      postgres:15     Up 2 minutes   0.0.0.0:5432->5432/tcp   webapp_postgres_dev
def456...      redis:7-alpine  Up 2 minutes   0.0.0.0:6379->6379/tcp   webapp_redis_dev
```

### 停止环境

```bash
# 停止开发环境
cd infra/docker
./stop-dev.sh

# 停止测试环境
./stop-test.sh
```

### 同时运行开发和测试环境

```bash
# 在一个终端窗口
cd infra/docker
./start-dev.sh

# 在另一个终端窗口
cd infra/docker
./start-test.sh

# 验证两个环境都在运行
docker ps
```

你应该看到 6 个容器（每个环境 3 个）：
- `webapp_postgres_dev` (端口 5432)
- `webapp_postgres_test` (端口 5433)
- `webapp_redis_dev` (端口 6379)
- `webapp_redis_test` (端口 6380)
- `webapp_flyway_dev`
- `webapp_flyway_test`

## 常见任务

### 查看日志

```bash
# 开发环境日志
docker-compose -f infra/docker/docker-compose.dev.yml logs -f

# 测试环境日志
docker-compose -f infra/docker/docker-compose.test.yml logs -f

# 只看数据库日志
docker logs -f webapp_postgres_dev
```

### 连接数据库

```bash
# 开发环境
docker exec -it webapp_postgres_dev psql -U appuser -d appdb_dev

# 测试环境
docker exec -it webapp_postgres_test psql -U appuser_test -d appdb_test
```

### 重置数据库（清空所有数据）

```bash
# ⚠️ 警告：这会删除所有数据！

# 开发环境
cd infra/docker
./stop-dev.sh
docker volume rm docker_db_dev_data docker_redis_dev_data
./start-dev.sh

# 测试环境
./stop-test.sh
docker volume rm docker_db_test_data docker_redis_test_data
./start-test.sh
```

## 环境配置

### 自定义端口

如果默认端口已被占用，编辑 `.env.dev` 或 `.env.test` 文件：

```bash
cd infra/docker

# 编辑开发环境配置
nano .env.dev

# 修改端口
POSTGRES_PORT=5434  # 改为其他端口
REDIS_PORT=6381     # 改为其他端口
```

然后重启容器：

```bash
./stop-dev.sh
./start-dev.sh
```

## 故障排查

### 问题：端口已被占用

```bash
# 查找占用端口的进程
lsof -i :5432
lsof -i :6379

# 停止旧容器
docker ps -a | grep postgres
docker rm -f <container_id>
```

### 问题：容器启动失败

```bash
# 查看详细日志
docker-compose -f infra/docker/docker-compose.dev.yml logs

# 检查容器状态
docker-compose -f infra/docker/docker-compose.dev.yml ps
```

### 问题：数据库连接失败

1. 检查容器是否运行：`docker ps`
2. 检查端口是否正确
3. 检查环境变量是否正确配置
4. 查看应用日志

### 问题：测试连接到开发数据库

确保在运行测试时使用 `test` profile：

```bash
# 检查环境变量
echo $SPRING_PROFILES_ACTIVE

# 显式指定
./gradlew :admin:test -Dspring.profiles.active=test
```

## 下一步

- 阅读完整文档：[infra/docker/README.md](infra/docker/README.md)
- 配置 IDE（IntelliJ IDEA / VS Code）
- 设置 Git hooks
- 配置 CI/CD

## 相关文档

- [Docker 环境配置详细文档](./infra/docker/README.md)
- [密码工具类使用指南](./admin/PASSWORD_UTIL_GUIDE.md)
- [API 文档](./docs/)
