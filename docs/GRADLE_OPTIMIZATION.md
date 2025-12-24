# Gradle 优化指南

本文档说明如何使用改进后的 Gradle 配置。

## 概述

为了提高项目的可维护性和构建性能，我们采用以下最佳实践：

1. **统一版本管理** - 使用 `gradle/libs.versions.toml`
2. **Convention Plugins** - 避免重复的构建配置
3. **Dependency Bundles** - 简化常用依赖组合的引入
4. **Build Cache** - 加速增量构建

## 核心文件说明

### gradle/libs.versions.toml
- **作用**: 集中管理所有依赖版本和 Gradle 插件版本
- **优势**: 
  - 单一位置修改版本
  - 类型安全的依赖引用
  - 支持版本范围和 Bill of Materials (BOM)

### buildSrc/
- **作用**: 存放 Convention Plugins，用于共享构建逻辑
- **内容**:
  - `JavaConventions.kt` - Java 模块通用配置
  - `KotlinConventions.kt` - Kotlin 模块通用配置
  
### Convention Plugins 的好处
```
不使用 Convention Plugins:
  
  admin/build.gradle.kts:
    plugins { ... }
    java { toolchain { ... } }  ← 重复
    repositories { ... }         ← 重复
    tasks.withType<Test> { ... } ← 重复
    
  website/build.gradle.kts:
    plugins { ... }
    java { toolchain { ... } }  ← 重复
    repositories { ... }         ← 重复
    kotlin { compilerOptions { ... } } ← 重复
    tasks.withType<Test> { ... } ← 重复

使用 Convention Plugins:
  
  admin/build.gradle.kts:
    plugins {
        id("com.night.java-conventions")  ← 自动应用共同配置
        id("org.springframework.boot")
        id("io.spring.dependency-management")
    }
    
  website/build.gradle.kts:
    plugins {
        id("com.night.kotlin-conventions") ← 自动应用共同配置
        id("org.jetbrains.kotlin.plugin.spring")
        id("org.springframework.boot")
        id("io.spring.dependency-management")
    }
```

## 迁移步骤

### 1. 创建或更新 gradle/libs.versions.toml
✅ 已完成 - 文件包含所有常用依赖

### 2. 创建 Convention Plugins (buildSrc/)
✅ 已完成 - 包含 Java 和 Kotlin 插件

### 3. 在根目录 build.gradle.kts 中应用 convention plugins
```kotlin
plugins {
    alias(libs.plugins.kotlin) apply false
    alias(libs.plugins.kotlinSpring) apply false
    alias(libs.plugins.springBoot) apply false
    alias(libs.plugins.springDependencyManagement) apply false
}

allprojects {
    repositories { mavenCentral() }
}

subprojects {
    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }
}
```

### 4. 更新各个模块的 build.gradle.kts

参考文件：
- `docs/example-admin-build.gradle.kts` - 简化后的 admin 配置
- `docs/example-website-build.gradle.kts` - 简化后的 website 配置
- `docs/example-shared-build.gradle.kts` - 新的 shared 模块配置

### 5. 验证构建
```bash
./gradlew clean build
```

## Dependency Bundles 使用

Bundle 是相关依赖的预定义集合，简化了声明：

```kotlin
// 不使用 Bundle
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-logging")
}

// 使用 Bundle
dependencies {
    implementation(libs.bundles.springBootWeb)
}
```

可用的 Bundles：
- `springBootWeb` - Web MVC 依赖
- `springBootWebflux` - Webflux 响应式依赖
- `kotlin` - Kotlin 基础库
- `jackson` - JSON 序列化库
- `testingCommon` - 通用测试框架
- `testingSpringWeb` - Spring Web 测试
- `testingKotlin` - Kotlin 测试

## 性能优化建议

### 1. 启用 Build Cache
```properties
# gradle.properties
org.gradle.caching=true
org.gradle.parallel=true
```

### 2. 增加 JVM 堆内存
```properties
# gradle.properties
org.gradle.jvmargs=-Xmx2g -XX:+UseG1GC
```

### 3. 使用守护进程
```bash
# 自动启用
./gradlew build --daemon
```

### 4. 只编译必要的模块
```bash
./gradlew :admin:build    # 仅构建 admin
./gradlew :website:build  # 仅构建 website
```

## 常见问题

### Q: 如何添加一个新的 library 到 libs.versions.toml？

A: 编辑 `gradle/libs.versions.toml`，按照以下格式添加：

```toml
[versions]
myLib = "1.0.0"

[libraries]
myLib = { group = "com.example", name = "my-lib", version.ref = "myLib" }
```

然后在 build.gradle.kts 中使用：
```kotlin
dependencies {
    implementation(libs.myLib)
}
```

### Q: 如何创建新的 Convention Plugin？

A: 在 `buildSrc/src/main/kotlin/com/night/gradle/` 中创建新的 Kotlin 文件：

```kotlin
class MyConventionPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        with(project) {
            pluginManager.apply("com.example.plugin")
            // 配置代码...
        }
    }
}
```

然后注册到 `buildSrc/build.gradle.kts`：
```kotlin
gradlePlugin {
    plugins {
        register("myConvention") {
            id = "com.night.my-conventions"
            implementationClass = "com.night.gradle.MyConventionPlugin"
        }
    }
}
```

### Q: 如何更新所有依赖到最新版本？

A: 修改 `gradle/libs.versions.toml` 中的版本号，然后运行：
```bash
./gradlew build --refresh-dependencies
```

### Q: Convention Plugin 不生效怎么办？

A: 重新构建 buildSrc：
```bash
./gradlew --stop  # 停止 Gradle 守护进程
./gradlew clean build
```

## 相关资源

- [Gradle Version Catalog 官方文档](https://docs.gradle.org/current/userguide/platforms.html)
- [Gradle Convention Plugins](https://docs.gradle.org/current/samples/sample_building_convention_plugins.html)
- [Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/html/)

---

**更新时间**: 2025-12-24

