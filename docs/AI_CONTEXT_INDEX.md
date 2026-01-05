# AI Context 快速索引

> **For AI Agents**: 快速定位各模块的AI Context和代码生成规则

## 🎯 快速导航

| 模块 | AI Context位置 | 核心架构 | 主要约束 |
|------|--------------|---------|---------|
| **Admin Backend** | [admin/README.md#ai-context](../admin/README.md#-aivibecode-context) | Pragmatic DDD | ApplicationService可直接访问Repository |
| **Admin Frontend** | [admin/frontend/README.md#ai-context](../admin/frontend/README.md#-aivibecode-context) + [prompt.md](../admin/frontend/prompt.md) | 三层架构 (pages/features/services) | 文件<200行，组件纯展示化 |
| **Website Backend** | [website/README.md#ai-context](../website/README.md#-aivibecode-context) | Reactive (Kotlin + Coroutines) | 禁止block()调用 |
| **Website Frontend** | [website/frontend/README.md](../website/frontend/README.md) + [prompt.md](../website/frontend/prompt.md) | Neubrutalism | 禁止硬编码文本 |
| **Common** | [common/README.md#ai-context](../common/README.md#-aivibecode-context) | 共享工具模块 | 保持Java兼容 |

---

## ⚡ 快速决策指南

### 我要添加新的后端API端点...

```
1. 确定模块
   ├─ 管理后台功能? → Admin Backend
   └─ 用户网站功能? → Website Backend

2. 查看对应Context
   ├─ Admin → admin/README.md#ai-context
   │   - 使用: Entity + Repository + ApplicationService + Controller
   │   - 决策: 简单CRUD用Repository，复杂业务用DomainService
   │
   └─ Website → website/README.md#ai-context
       - 使用: Entity + Repository + Service(suspend) + Handler
       - 注意: 所有IO操作必须用suspend函数
```

### 我要创建新的前端页面...

```
1. 确定前端类型
   ├─ 后台管理? → Admin Frontend
   │   - 参考: admin/frontend/README.md + CODING_STANDARDS.md
   │   - 架构: Page → Features → Services
   │   - 规则: 组件<200行，表格必须纯展示
   │
   └─ 用户网站? → Website Frontend
       - 参考: website/frontend/WORKFLOW_CN.md
       - 风格: Neubrutalism (粗边框+硬阴影)
       - 规则: 必须国际化，禁止硬编码文本
```

### 我要定义API响应格式...

→ 查看 [docs/API_STANDARDS.md](./API_STANDARDS.md#统一响应格式)

### 我要添加共享工具类...

```
1. 是否被多个模块使用?
   ├─ 是 → 放入 common 模块
   │   - 参考: common/README.md#使用决策树
   │   - 位置: exception/ dto/ util/ extension/
   │
   └─ 否 → 放入具体模块
       - Admin特有 → admin/...
       - Website特有 → website/...
```

---

## 📋 全局规范文档

### API设计规范
📋 **[API_STANDARDS.md](./API_STANDARDS.md)**
- 统一响应格式
- RESTful路径设计
- 分页参数规范
- 错误码定义

### 架构总览
🏗️ **[ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)**
- 项目整体架构
- 模块间依赖关系
- 技术栈选型说明

### 贡献指南
🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)**
- 开发流程
- Commit规范
- PR要求

### 常见问题汇总
❓ **[FAQ.md](./FAQ.md)**
- 所有模块的常见问题
- 故障排查指南

---

## 🤖 AI代码生成最佳实践

### 1. 开始前必读

1. **定位模块** - 使用上方快速决策指南
2. **阅读AI Context** - 打开对应模块的AI Context部分
3. **查看代码模板** - 复制并修改模板代码
4. **遵循决策树** - 按照if-else逻辑选择方案

### 2. 代码生成规则优先级

```
P0 - 强制规则 (❌禁止违反)
├─ Admin Backend: Controller不能直接调用Repository
├─ Admin Frontend: 文件必须<200行
├─ Website Backend: 禁止使用block()
└─ Website Frontend: 禁止硬编码文本

P1 - 推荐实践 (⭐应该遵循)
├─ 使用DTO进行数据传输
├─ 统一ApiResponse格式
└─ Lombok注解简化代码

P2 - 最佳实践 (💡建议采用)
└─ 详见各模块CODING_STANDARDS
```

### 3. 常用代码模板快速链接

| 需求 | 模板位置 |
|------|---------|
| Spring Boot Entity | [admin/README.md#entity定义](../admin/README.md#1-entity定义) |
| JPA Repository | [admin/README.md#repository接口](../admin/README.md#2-repository接口) |
| ApplicationService | [admin/README.md#applicationservice模板](../admin/README.md#5-applicationservice模板) |
| React Hook | [admin/frontend/README.md#custom-hook标准模板](../admin/frontend/README.md#5-custom-hook标准模板) |
| R2DBC Entity | [website/README.md#entity定义](../website/README.md#1-entity定义r2dbc) |
| Kotlin suspend Service | [website/README.md#service实现](../website/README.md#3-service实现-suspend函数) |

---

## 📚 学习路径

### 新加入项目？

**Day 1**: 快速上手
1. 阅读 [QUICKSTART.md](../QUICKSTART.md) - 5分钟启动项目
2. 阅读 [README.md](../README.md) - 了解项目全貌

**Day 2-3**: 深入模块
1. 后端开发者 → 阅读 `admin/README.md` 或 `website/README.md`
2. 前端开发者 → 阅读 `admin/frontend/README.md` 或 `website/frontend/WORKFLOW_CN.md`

**Week 1**: 实践
1. 完成模块的"新人第一步"任务
2. 参考代码模板实现简单功能
3. 遇到问题查看 [FAQ.md](./FAQ.md)

### AI辅助开发？

1. **打开本文档** (AI_CONTEXT_INDEX.md)
2. **使用快速决策** 定位需要的Context
3. **复制代码模板** 并修改
4. **验证强制规则** 确保不违反P0规则

---

## 🔄 文档维护

### 何时更新此索引？

- ✅ 添加新模块时
- ✅ 修改架构风格时
- ✅ 更新核心规则时
- ✅ 发现文档链接失效时

### 更新流程

1. 修改对应模块的README.md
2. 更新本索引文件
3. 提交PR并标注"docs"标签

---

**让AI成为你的高效编程助手！** 🚀
