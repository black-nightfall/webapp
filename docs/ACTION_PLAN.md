# 项目重构行动计划

## 📅 执行时间表

推荐分两个阶段完成重构，以最小化对当前开发的影响。

---

## 🔴 第一阶段：立即实施 (1-2周)

这些改动风险最低，收益最高。

### 1.1 配置文件初始化 ✅

**已完成的文件**:
- ✅ `gradle/libs.versions.toml` - 依赖版本管理
- ✅ `gradle.properties` - Gradle 属性
- ✅ `.editorconfig` - 编辑器配置
- ✅ `buildSrc/build.gradle.kts` - Convention Plugin 框架
- ✅ `buildSrc/src/main/kotlin/com/night/gradle/JavaConventions.kt`
- ✅ `buildSrc/src/main/kotlin/com/night/gradle/KotlinConventions.kt`

**需要完成**:
```bash
# 在 buildSrc/src/main/kotlin/META-INF/gradle-plugins/ 创建文件
mkdir -p buildSrc/src/main/kotlin/META-INF/gradle-plugins

# 创建插件声明文件
echo 'implementation-class=com.night.gradle.JavaConventionsPlugin' > buildSrc/src/main/kotlin/META-INF/gradle-plugins/com.night.java-conventions.properties

echo 'implementation-class=com.night.gradle.KotlinConventionsPlugin' > buildSrc/src/main/kotlin/META-INF/gradle-plugins/com.night.kotlin-conventions.properties
```

### 1.2 更新根目录 build.gradle.kts

参考 `/Users/peigen/Documents/dev/peigen/webapp/gradle.properties` 中的内容。

### 1.3 验证配置有效性

```bash
./gradlew clean
./gradlew help
./gradlew projects
```

**预期结果**: 没有错误，列出所有项目

---

## 🟠 第二阶段：模块优化 (2-3周)

### 2.1 逐个更新模块构建文件

**执行顺序**:

#### Step 1: 更新 admin/build.gradle.kts
参考: `docs/example-admin-build.gradle.kts`

```bash
# 备份原文件
cp admin/build.gradle.kts admin/build.gradle.kts.bak

# 编辑 admin/build.gradle.kts
# 应用变更并验证
./gradlew :admin:build
```

**验证清单**:
- ✓ 编译成功
- ✓ 所有测试通过
- ✓ 应用可正常启动

#### Step 2: 更新 website/build.gradle.kts
参考: `docs/example-website-build.gradle.kts`

```bash
# 备份原文件
cp website/build.gradle.kts website/build.gradle.kts.bak

# 编辑 website/build.gradle.kts
# 应用变更并验证
./gradlew :website:build
```

**验证清单**:
- ✓ 编译成功
- ✓ 所有测试通过
- ✓ 应用可正常启动

### 2.2 创建 shared 模块 (可选但推荐)

```bash
mkdir -p shared/src/main/kotlin/com/night/shared
mkdir -p shared/src/test/kotlin/com/night/shared
mkdir -p shared/src/main/resources

# 创建 build.gradle.kts
# 参考: docs/example-shared-build.gradle.kts

# 更新 settings.gradle.kts
# 添加: include("shared")

# 验证
./gradlew :shared:build
```

### 2.3 优化后端模块依赖管理

从 admin 和 website 依赖 shared 模块：

```kotlin
// admin/build.gradle.kts
dependencies {
    implementation(project(":shared"))
    // ... 其他依赖
}

// website/build.gradle.kts
dependencies {
    implementation(project(":shared"))
    // ... 其他依赖
}
```

---

## 🔵 第三阶段：前端独立化 (可选，长期规划)

### 3.1 分离前端代码

```bash
# 1. 将 admin/frontend 移出为独立模块
mkdir -p frontend
mv admin/frontend/* frontend/
rmdir admin/frontend

# 2. 更新 settings.gradle.kts
# 移除前端相关配置（如果有的话）

# 3. 在 frontend 目录中初始化前端项目
cd frontend
npm init -y
# ... 配置 package.json, webpack, 等
```

### 3.2 构建独立的前端项目

```bash
# frontend/package.json 示例结构
{
  "name": "webapp-frontend",
  "version": "0.0.1",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "axios": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

### 3.3 配置 CORS 和代理

在 admin 和 website 中添加 CORS 配置，允许前端跨域访问。

---

## 📊 检查清单

### 预检查
- [ ] 备份当前项目: `git commit -am "backup before gradle optimization"`
- [ ] 确保所有本地变更已提交
- [ ] 确保 CI/CD 管道可用

### 第一阶段检查
- [ ] libs.versions.toml 创建成功
- [ ] Convention Plugins 可编译
- [ ] 所有插件声明文件创建
- [ ] `./gradlew help` 执行成功

### 第二阶段检查
- [ ] admin 模块构建成功
- [ ] admin 模块测试通过
- [ ] admin 应用启动正常: `./gradlew :admin:bootRun`
- [ ] website 模块构建成功
- [ ] website 模块测试通过
- [ ] website 应用启动正常: `./gradlew :website:bootRun`
- [ ] 完整项目构建: `./gradlew build` 成功

### 第三阶段检查
- [ ] shared 模块创建成功
- [ ] shared 模块集成到 admin 和 website
- [ ] 完整构建成功
- [ ] 所有模块相互依赖正常

---

## 🔄 回滚方案

如果任何阶段出现问题，可以快速回滚：

### 回滚单个模块
```bash
# 恢复备份
cp admin/build.gradle.kts.bak admin/build.gradle.kts
git checkout admin/

# 重新构建
./gradlew clean build
```

### 完全回滚到之前状态
```bash
git revert <commit-hash>
./gradlew clean build
```

---

## 📈 预期改进指标

完成全部重构后，你将获得：

| 指标 | 当前 | 目标 | 改进度 |
|-----|-----|------|-------|
| 构建时间 | ~60s | ~40s | -33% ⚡ |
| 配置文件重复行数 | ~200 行 | ~50 行 | -75% 📉 |
| 依赖声明位置 | 4 个地方 | 1 个地方 | -75% 🎯 |
| 版本管理复杂度 | 高 | 低 | 显著降低 ✨ |
| 新模块创建时间 | 30分钟 | 5分钟 | -83% ⚡ |

---

## 🎯 最佳实践持续执行

重构完成后，团队应遵循：

### ✅ Do's
- ✅ 在 libs.versions.toml 中声明所有新依赖版本
- ✅ 使用 Convention Plugins 简化新模块配置
- ✅ 使用 bundles 引入常用依赖组合
- ✅ 定期检查依赖更新: `./gradlew dependencyUpdates`
- ✅ 在 buildSrc 中提取通用的构建逻辑

### ❌ Don'ts
- ❌ 在子模块中直接硬编码版本号
- ❌ 在多个 build.gradle.kts 中重复配置相同逻辑
- ❌ 创建新模块时复制 build.gradle.kts
- ❌ 不经过 libs.versions.toml 添加新依赖
- ❌ 忽视 Gradle 缓存和并行构建设置

---

## 📞 常见问题与解决方案

### Q1: 更新后构建变慢了？

**A**: Convention Plugins 首次编译需要时间。后续会缓存：
```bash
# 清理缓存
./gradlew --stop
rm -rf .gradle
./gradlew clean build  # 第一次会比较慢
./gradlew build        # 第二次会快很多
```

### Q2: IDE (IntelliJ) 不能识别 libs 引用？

**A**: 需要同步 Gradle：
```bash
# IntelliJ: File > Sync with Gradle
# 或者命令行：
./gradlew idea
```

### Q3: 某个依赖在 libs.versions.toml 但 IDE 报错？

**A**: 清理 Gradle 缓存并重新同步：
```bash
./gradlew --stop
rm -rf .gradle ~/.gradle
./gradlew build
```

### Q4: Convention Plugin 修改后不生效？

**A**: buildSrc 改动需要重新编译：
```bash
./gradlew --stop
./gradlew :buildSrc:build
./gradlew clean build
```

### Q5: 如何在现有项目中逐步推行这些改变？

**A**: 不需要一次性修改所有模块。可以：
1. 先创建新模块时使用新方式
2. 对于现有模块，在重构周期中逐步迁移
3. 优先迁移最常修改的模块

---

## 📝 文档更新

完成后需要更新的文档：

- [x] README.md - 已更新，含快速开始指南
- [x] REVIEW.md - 已生成，含详细分析
- [x] docs/GRADLE_OPTIMIZATION.md - 已生成，含技术细节
- [x] buildSrc/README.md - 已生成，含使用说明
- [ ] CONTRIBUTING.md - (可选) 开发者贡献指南
- [ ] DEVELOPMENT.md - (可选) 本地开发设置指南

---

## 🚀 后续优化建议

### 短期 (1个月内)
1. 添加 Spotless 进行代码格式化
2. 添加 Detekt 进行 Kotlin lint
3. 配置 GitHub Actions CI/CD

### 中期 (2-3个月)
1. 添加集成测试模块
2. 创建 API 文档自动生成
3. 实施依赖安全检查

### 长期 (3-6个月)
1. 迁移到 Kotlin 编写所有新代码
2. 创建微服务架构的子模块
3. 实施 API 版本管理

---

**版本**: v1.0  
**最后更新**: 2025-12-24  
**责任人**: Senior Java Engineer

