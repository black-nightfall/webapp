# Admin 后端项目现代化架构

## 目录结构

采用现代化的领域驱动设计(DDD)和整洁架构模式：

```
com.night.admin
├── presentation (表示层 - Controllers)
│   ├── auth
│   ├── order
│   ├── product
│   └── user
├── application (应用层 - Services)
│   ├── auth
│   ├── order
│   ├── product
│   └── user
├── domain (领域层 - Entities, Business Logic)
│   ├── auth
│   ├── order
│   ├── product
│   └── user
├── infrastructure (基础设施层 - Config, Security, Persistence)
│   ├── config
│   ├── security
│   ├── persistence
│   ├── repository
│   └── adapter
├── exception
└── util
```

## 各层职责

### 1. Presentation Layer (表示层)
- 负责处理HTTP请求和响应
- 不包含业务逻辑
- 调用Application层服务
- 包含Controller类

### 2. Application Layer (应用层)
- 协调领域对象完成业务逻辑
- 包含Application Service
- 处理事务边界
- 协调不同领域服务

### 3. Domain Layer (领域层)
- 核心业务逻辑
- 领域实体和值对象
- 领域服务
- 业务规则和验证
- Repository接口定义

### 4. Infrastructure Layer (基础设施层)
- 技术实现细节
- 数据库访问实现
- 外部服务集成
- 安全配置
- 框架配置

## 迁移步骤

### 第一步：创建新包结构

```
mkdir -p admin/src/main/java/com/night/admin/{presentation,application,domain,infrastructure}
mkdir -p admin/src/main/java/com/night/admin/infrastructure/{config,security,persistence,repository,adapter}
```

### 第二步：迁移现有代码

1. **Controllers** → `presentation`
2. **Services** → `application` 
3. **Entities, Models** → `domain`
4. **Repositories** → `infrastructure.repository`
5. **Security, Config** → `infrastructure`
6. **保持** Exceptions, Utils 不变

### 第三步：更新包导入

修改所有Java文件的package声明以匹配新结构。

## 重构示例

### 迁移前:
```
com.night.admin.domain.auth
├── AuthController.java
├── AuthService.java
├── User.java
├── UserRepository.java
└── security/
    └── JwtAuthenticationFilter.java
```

### 迁移后:
```
com.night.admin.presentation.auth
└── AuthController.java

com.night.admin.application.auth
└── AuthService.java

com.night.admin.domain.auth
└── User.java

com.night.admin.infrastructure.repository
└── UserRepository.java

com.night.admin.infrastructure.security
└── JwtAuthenticationFilter.java
```

## 依赖关系规则

- **Presentation** → **Application** (表示层依赖应用层)
- **Application** → **Domain** (应用层依赖领域层)  
- **Application** → **Infrastructure** (应用层依赖基础设施层接口)
- **Domain** → 无外部依赖 (领域层独立)
- **Infrastructure** → **Domain** (基础设施层实现领域层定义的接口)

## 优势

1. **清晰的职责分离**: 每层有明确的职责
2. **可测试性**: 各层可独立测试
3. **可维护性**: 更改技术实现不影响业务逻辑
4. **可扩展性**: 易于添加新的表示方式或数据源
5. **符合单一职责原则**: 每个类只负责一个方面的功能