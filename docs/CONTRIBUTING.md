# 贡献指南

> 欢迎为项目做出贡献！本文档将指导你如何参与项目开发。

## 📋 目录

- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [Commit规范](#commit规范)
- [Pull Request要求](#pull-request要求)
- [测试要求](#测试要求)

---

## 开发流程

### 1. Fork并克隆项目

```bash
# Fork项目到你的GitHub账户，然后clone
git clone https://github.com/YOUR_USERNAME/webapp.git
cd webapp

# 添加上游仓库
git remote add upstream https://github.com/ORIGINAL_OWNER/webapp.git
```

### 2. 创建功能分支

```bash
# 从main分支创建功能分支
git checkout -b feature/your-feature-name

# 或修复bug
git checkout -b fix/bug-description
```

### 3. 开发和测试

```bash
# 启动开发环境
./gradlew :admin:bootRun  # 后端
cd admin/frontend && npm run dev  # 前端

# 运行测试
./gradlew :admin:test
cd admin/frontend && npm test
```

### 4. 提交代码

遵循 [Commit规范](#commit规范)

### 5. 推送并创建PR

```bash
git push origin feature/your-feature-name
```

然后在GitHub创建Pull Request。

---

## 代码规范

### 后端（Java/Kotlin）

- **格式化**: 使用IntelliJ IDEA默认格式
- **命名**:
  - 类名: `PascalCase`
  - 方法名: `camelCase`
  - 常量: `UPPER_SNAKE_CASE`
- **注释**: 公共API必须包含JavaDoc/KDoc

### 前端（TypeScript/React）

- **格式化**: 使用Prettier
- **命名**:
  - 组件: `PascalCase`
  - 函数/变量: `camelCase`
  - 文件: `PascalCase.tsx` (组件), `camelCase.ts` (工具)
- **文件大小**: 单文件不超过200行

### 遵循模块规范

- **Admin Backend**: [admin/README.md](../admin/README.md#-开发规范)
- **Admin Frontend**: [admin/frontend/CODING_STANDARDS.md](../admin/frontend/CODING_STANDARDS.md)
- **Website Backend**: [website/README.md](../website/README.md#-开发规范)
- **Website Frontend**: [website/frontend/WORKFLOW_CN.md](../website/frontend/WORKFLOW_CN.md)

---

## Commit规范

### Commit Message格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

| Type | 说明 | 示例 |
|------|------|------|
| **feat** | 新功能 | `feat(admin): 添加用户导出功能` |
| **fix** | Bug修复 | `fix(website): 修复登录403错误` |
| **docs** | 文档更新 | `docs: 更新README安装说明` |
| **style** | 格式调整 | `style(admin): 格式化代码` |
| **refactor** | 重构 | `refactor(common): 重构ApiResponse` |
| **test** | 测试 | `test(admin): 添加用户服务测试` |
| **chore** | 构建/工具 | `chore: 更新依赖版本` |
| **perf** | 性能优化 | `perf(website): 优化查询性能` |

### 示例

```bash
# 新功能
git commit -m "feat(admin): 添加角色权限分配功能"

# Bug修复
git commit -m "fix(website): 修复分页参数错误

- 修正page参数从1-indexed到0-indexed
- 添加边界检查
"

# 文档更新
git commit -m "docs: 更新AI Context使用指南"
```

### 规则

- ✅ 使用英文或中文（保持一致）
- ✅ subject简洁明了（<50字符）
- ✅ 一个commit只做一件事
- ❌ 避免 "update", "fix bug" 等模糊描述

---

## Pull Request要求

### PR标题

遵循Commit Message格式：
```
feat(admin): 添加用户导出功能
```

### PR描述模板

```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 变更说明
简要描述你的变更内容

## 相关Issue
Closes #123

## 测试
- [ ] 已添加单元测试
- [ ] 已通过所有测试
- [ ] 已手动测试

## 截图（如适用）
[添加截图]

## Checklist
- [ ] 代码遵循项目规范
- [ ] 已更新相关文档
- [ ] Commit message遵循规范
- [ ] 没有引入breaking changes（或已在描述中说明）
```

### Review流程

1. 创建PR后，自动运行CI检查
2. 至少1位maintainer审查
3. 所有审查意见解决后合并
4. 使用 "Squash and merge" 保持提交历史清晰

---

## 测试要求

### 后端测试

```bash
# 运行所有测试
./gradlew test

# 运行特定模块测试
./gradlew :admin:test
./gradlew :website:test

# 生成测试覆盖率报告
./gradlew jacocoTestReport
```

**要求**：
- 新功能必须包含单元测试
- 关键业务逻辑测试覆盖率>80%
- 使用JUnit 5 + Mockito

### 前端测试

```bash
# 运行测试
cd admin/frontend
npm test

# 生成覆盖率报告
npm run test:coverage
```

**要求**：
- 组件测试使用React Testing Library
- 工具函数必须包含测试
- 关键业务逻辑测试覆盖率>70%

---

## 文档更新

### 何时更新文档？

- ✅ 添加新功能 → 更新对应模块README
- ✅ 修改API → 更新API_STANDARDS.md
- ✅ 架构变更 → 更新ARCHITECTURE_OVERVIEW.md
- ✅ 新增常见问题 → 更新FAQ.md

### 文档规范

- 使用Markdown格式
- 包含代码示例
- 保持AI友好性（参考现有文档的AI Context部分）
- 更新相关交叉引用链接

---

## 常见问题

### Q: 如何同步上游更新？

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### Q: PR被要求修改怎么办？

在你的功能分支继续修改并推送：
```bash
# 修改代码
git add .
git commit -m "fix: 根据review修改"
git push origin feature/your-feature-name
```

### Q: 需要帮助？

- 查看 [FAQ.md](./FAQ.md)
- 查看模块的README文档
- 在Issue中提问
- 联系maintainers

---

## 行为准则

- 尊重所有贡献者
- 建设性的反馈
- 耐心帮助新手
- 专注于代码质量

---

**感谢你的贡献！** 🙏
