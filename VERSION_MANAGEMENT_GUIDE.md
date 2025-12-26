# 项目版本统一管理指南

本文档总结了如何在项目中实现依赖版本的统一管理，确保所有模块都使用父工程的libs.versions.toml进行版本控制。

## 父工程依赖管理结构

项目使用Gradle的Version Catalogs功能，在`gradle/libs.versions.toml`文件中统一管理所有依赖版本。

### 主要组件
- **[versions]**: 定义所有依赖的版本号
- **[libraries]**: 定义具体的库及其版本引用
- **[bundles]**: 定义依赖组合，便于一次性引入多个相关依赖
- **[plugins]**: 定义Gradle插件版本

## 添加新依赖的步骤

1. **在libs.versions.toml中添加库定义**
   ```toml
   # 例如添加新的库
   [libraries]
   library-name = { group = "com.example", name = "library", version.ref = "versionRef" }
   
   # 或者引用已存在的版本
   another-library = { group = "com.example", name = "another-lib", version.ref = "springBoot" }
   ```

2. **如果需要，创建依赖组合**
   ```toml
   [bundles]
   bundle-name = [
       "library-name",
       "another-library"
   ]
   ```

3. **在模块中使用**
   ```kotlin
   dependencies {
       implementation(libs.library.name)
       implementation(libs.bundles.bundle.name)
   }
   ```

## 已存在的依赖库

### Spring Boot相关
- `libs.bundles.springBootWeb` - 包含Web开发核心依赖
- `libs.bundles.springBootWebflux` - 包含WebFlux响应式开发依赖
- `libs.spring.data.jpa` - Spring Data JPA
- `libs.spring.data.redis` - Spring Data Redis
- `libs.spring.boot.starter.security` - Spring Security
- `libs.spring.security.test` - Spring Security测试

### JWT和安全相关
- `libs.bundles.jwt` - JWT相关依赖组合

### 数据库相关
- `libs.postgresql.driver` - PostgreSQL驱动
- `libs.bundles.database` - 数据库相关依赖组合

### 测试相关
- `libs.bundles.testingSpringWebComplete` - 完整的Web项目测试依赖
- `libs.bundles.testingKotlinComplete` - 完整的Kotlin项目测试依赖

## 最佳实践

1. **始终使用libs.versions.toml管理依赖**
   - 不要在模块的build.gradle.kts中硬编码依赖版本
   - 优先使用已定义的bundles，以确保依赖兼容性

2. **依赖命名约定**
   - 库名使用横线分隔，如`spring-boot-starter-security`
   - 在代码中引用时会自动转换为驼峰命名，如`libs.spring.boot.starter.security`

3. **版本复用**
   - 优先引用已存在的版本引用（version.ref），避免重复定义版本号
   - 对于Spring生态的库，优先使用`version.ref = "springBoot"`以确保版本兼容

4. **Bundle使用**
   - 对于功能相关的多个依赖，使用bundle一次性引入
   - 这有助于保持依赖版本的一致性

## 验证步骤

每次添加或修改依赖后，运行以下命令验证构建：

```bash
./gradlew build
```

## 常见问题

1. **依赖无法解析**
   - 检查libs.versions.toml中的定义是否正确
   - 确认Gradle属性是否正确引用了版本引用

2. **版本冲突**
   - 使用dependencyInsight任务检查依赖树
   - 统一依赖版本到libs.versions.toml中管理