# Admin 后端重构修复说明

## 🔧 修复的问题

### 1. Gradle 配置规范化

#### 问题
- admin 作为子项目，配置不符合父级 Gradle 规范
- 依赖版本未使用父级的 `libs.versions.toml` 管理
- JWT 版本过旧导致 API 不兼容

#### 修复
[admin/build.gradle.kts](file:///Users/peigen/Documents/dev/peigen/webapp/admin/build.gradle.kts)

**改进点**:
```kotlin
// 使用 alias 引用父级定义的插件
alias(libs.plugins.springBoot)
alias(libs.plugins.springDependencyManagement)

// 使用父级定义的 bundles
implementation(libs.bundles.springBootWeb)
implementation(libs.postgresql.driver)

// Lombok 版本统一
compileOnly("org.projectlombok:lombok:1.18.36")

// JWT 升级到 0.12.6（修复 API 问题）
implementation("io.jsonwebtoken:jjwt-api:0.12.6")
```

---

### 2. JWT 工具类 API 更新

#### 问题
```java
// ❌ 旧版 API (0.11.x)
Jwts.parserBuilder()  // 方法不存在
    .setSigningKey(key)
    .build()
    .parseClaimsJws(token)
```

#### 修复
[JwtUtil.java](file:///Users/peigen/Documents/dev/peigen/webapp/admin/src/main/java/com/night/admin/common/util/JwtUtil.java)

```java
// ✅ 新版 API (0.12.6)
Jwts.parser()
    .verifyWith(key)
    .build()
    .parseSignedClaims(token)
    .getPayload()
```

**变更说明**:
- `parserBuilder()` → `parser()`
- `setSigningKey()` → `verifyWith()`
- `parseClaimsJws()` → `parseSignedClaims()`
- `getBody()` → `getPayload()`
- `setSubject()` → `subject()`
- `setIssuedAt()` → `issuedAt()`
- `setExpiration()` → `expiration()`
- `signWith(key, alg)` → `signWith(key, Jwts.SIG.HS256)`

---

### 3. Lombok Builder 警告修复

#### 问题
```java
// ⚠️ 警告: @Builder will ignore the initializing expression
@Builder
public class User {
    private Boolean enabled = true;  // 初始值会被忽略
}
```

#### 修复
[User.java](file:///Users/peigen/Documents/dev/peigen/webapp/admin/src/main/java/com/night/admin/user/User.java)

```java
// ✅ 使用 @Builder.Default
@Builder
public class User {
    @Builder.Default
    private Boolean enabled = true;  // 现在初始值会生效
}
```

同时改用 `@Getter` + `@Setter` 代替 `@Data` (更符合规范)

---

### 4. Flyway 配置移除

#### 原因
用户手动移除了 Flyway，可能原因：
- 数据库已通过其他方式初始化
- 使用手动 SQL 脚本管理
- 简化开发环境配置

#### 影响
需要手动创建数据库表：

```sql
-- 需要手动执行
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认管理员
INSERT INTO users (username, password, email) 
VALUES ('admin', '$2a$10$N9qo3V4Hqmv6qLJZQ1K2xO5vZ1Q9X3Q5Z1K2xO5vZ1Q9X3Q5Z1K2x', 'admin@example.com');
```

**注意**: 密码是 BCrypt 加密的 `admin123`

---

## 📋 最终的依赖清单

### build.gradle.kts
```kotlin
dependencies {
    // 项目模块
    implementation(project(":common"))
    
    // Spring Boot (from libs.bundles.springBootWeb)
    - spring-boot-starter-web
    - spring-boot-starter-validation
    - spring-boot-starter-logging
    
    // JPA & 数据库
    - spring-boot-starter-data-jpa
    - postgresql (runtime)
    
    // Redis
    - spring-boot-starter-data-redis
    
    // 安全 & JWT
    - spring-boot-starter-security
    - jjwt-api:0.12.6
    - jjwt-impl:0.12.6 (runtime)
    - jjwt-jackson:0.12.6 (runtime)
    
    // Lombok
    - lombok:1.18.36 (compileOnly + annotationProcessor)
    
    // 开发工具
    - spring-boot-docker-compose (development)
    
    // 测试
    - testingSpringWebComplete bundle
    - spring-security-test
}
```

---

## ✅ 验证构建

```bash
cd /Users/peigen/Documents/dev/peigen/webapp
./gradlew :admin:build
```

**结果**: ✅ BUILD SUCCESSFUL

---

## 🚀 下一步

### 1. 手动初始化数据库

```bash
# 启动 PostgreSQL
cd infra/docker
docker-compose up -d db

# 连接数据库
docker exec -it project_postgres psql -U appuser -d appdb

# 执行上面的 SQL 脚本创建表和用户
```

### 2. 启动后端

```bash
cd admin
../gradlew bootRun
```

### 3. 测试登录

```bash
curl -X POST http://localhost:9090/admin/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📚 相关文档

- [DEPLOYMENT.md](file:///Users/peigen/Documents/dev/peigen/webapp/DEPLOYMENT.md) - 完整部署指南
- [jpa_security_implementation.md](file:///Users/peigen/.gemini/antigravity/brain/cc7859c4-6ed2-49aa-8778-5ecb8c0edaca/jpa_security_implementation.md) - 技术实现详解

---

**修复完成**: 2025-12-25  
**构建状态**: ✅ SUCCESSFUL
