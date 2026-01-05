# AI Vibe Coding 提示语指南

> 如何使用项目文档让AI高效创建功能和更新模块

## 🎯 核心策略

**关键原则**：先让AI阅读相关文档的AI Context，然后提供具体需求。

---

## 📝 场景1：创建新功能

### 步骤流程

**Step 1: 定位模块** → **Step 2: 提供上下文** → **Step 3: 描述需求** → **Step 4: 指定模板**

### 1.1 创建Admin后端API（Java/Kotlin）

**提示语模板**：

```
请先阅读以下文档的AI Context部分：
- admin/README.md#ai-context
- docs/API_STANDARDS.md

然后帮我实现一个Product（产品）管理模块，需求如下：

【功能需求】
1. 实体字段：id, name, price, stock, createdAt, updatedAt
2. 功能：完整CRUD（创建、查询列表、查询详情、更新、删除）
3. 分页查询支持

【技术要求】
- 遵循Pragmatic DDD架构
- 使用JPA + PostgreSQL
- 返回统一ApiResponse格式
- 添加参数校验（@Valid）

参考admin/README.md中的决策树和代码模板来实现。
```

**AI会自动**：
- 读取Architecture风格（Pragmatic DDD）
- 使用Entity + Repository + ApplicationService模板
- 遵循API路径规范（/admin/products）
- 返回统一格式

### 1.2 创建Admin前端CRUD页面（React）

**提示语模板**：

```
请先阅读：
- admin/frontend/prompt.md
- admin/frontend/CODING_STANDARDS.md#代码模板

我需要创建一个Product管理页面，要求：

【功能需求】
1. 表格显示：ID、名称、价格、库存、创建时间
2. CRUD操作：创建、编辑、删除（带确认）
3. 搜索：按名称搜索
4. 分页：每页10条

【技术要求】
- 严格遵循三层架构（pages/features/services）
- 每个文件<200行
- 使用Ant Design组件
- 参考user模块的实现风格

按照CODING_STANDARDS.md中的5大模板来实现。
```

**AI会自动**：
- 创建标准结构（ProductTable.tsx + hooks + components）
- 遵守文件大小限制
- 使用Props化组件
- 处理分页（0-indexed转1-indexed）

### 1.3 创建Website后端API（Kotlin + WebFlux）

**提示语模板**：

```
请先阅读：
- website/README.md#ai-context

我需要添加Comment（评论）模块到Website后端：

【功能需求】
1. 实体：id, newsId, content, authorName, createdAt
2. 功能：创建评论、获取某新闻的评论列表
3. 返回格式：直接返回List或单个对象（非ApiResponse）

【技术要求】
- 使用Kotlin + Coroutines
- R2DBC响应式数据库
- 所有IO操作必须是suspend函数
- 禁止使用block()

参考website/README.md中的决策树和Handler/Service模板。
```

**AI会自动**：
- 使用suspend函数
- 正确使用awaitSingle/asFlow
- 避免阻塞调用
- 创建Router配置

### 1.4 创建Website前端页面（Next.js）

**提示语模板**：

```
请先阅读：
- website/frontend/prompt.md
- website/frontend/WORKFLOW_CN.md

我需要创建一个评论组件用于新闻详情页：

【功能需求】
1. 显示评论列表
2. 发表评论表单
3. Neubrutalism风格

【技术要求】
- 使用CatContainer包裹
- 必须国际化（next-intl）
- 禁止硬编码文本
- 使用Service层做API调用

参考WORKFLOW_CN.md的完整流程。
```

---

## 🔧 场景2：更新现有模块

### 2.1 修改Admin后端模块

**提示语模板**：

```
请先阅读admin/README.md#ai-context，然后帮我修改User模块：

【当前代码位置】
- Entity: admin/src/.../domain/user/entity/User.java
- Service: admin/src/.../application/service/UserService.java

【修改需求】
1. 添加新字段：phoneNumber（手机号）
2. 添加手机号验证逻辑
3. 添加按手机号搜索功能

【要求】
- 遵循现有代码风格
- 添加Bean Validation注解
- 更新Flyway migration

先展示修改计划，确认后再执行。
```

**AI会**：
- 理解现有架构
- 保持代码风格一致
- 添加必要的验证
- 提供数据库迁移脚本

### 2.2 重构Admin前端组件

**提示语模板**：

```
请先阅读：
- admin/frontend/README.md
- admin/frontend/CODING_STANDARDS.md

现有问题：
admin/frontend/src/pages/ProductsPage.tsx 文件已经350行，违反了<200行的规则。

【重构需求】
1. 拆分为符合标准的结构
2. 提取业务逻辑到Hook
3. 拆分Modal到components/

【要求】
- 严格遵循三层架构
- 每个文件<200行
- 保持现有功能不变
- 参考user模块的标准实现

提供重构方案，包括文件结构和关键代码。
```

### 2.3 优化Website后端性能

**提示语模板**：

```
请先阅读website/README.md#ai-context

现有问题：
NewsService.getAll() 每次都查询全部新闻，性能差。

【优化需求】
1. 添加分页支持
2. 添加缓存（Redis）
3. 保持响应式（不能用block()）

【要求】
- 使用Kotlin Coroutines
- R2DBC手动分页（参考FAQ）
- 添加缓存注解或手动缓存

参考docs/FAQ.md中的R2DBC分页示例。
```

---

## 🚀 高级技巧

### 技巧1：多文档组合阅读

```
请先阅读以下文档：
1. docs/AI_CONTEXT_INDEX.md - 了解项目全貌
2. admin/README.md#ai-context - Admin后端架构
3. docs/API_STANDARDS.md - API规范

然后实现一个完整的Order（订单）模块，包括：
- 后端API（Admin）
- 前端CRUD页面（Admin Frontend）
- 符合所有项目规范
```

### 技巧2：引用决策树

```
根据admin/README.md中的决策树：

"ApplicationService需要访问数据？
├─ 是否涉及复杂业务规则（>3行逻辑）？
│  ├─ 是 → 调用 Domain Service
│  └─ 否 → 直接用 Repository"

我的创建订单逻辑包括：
1. 扣减库存
2. 计算总价
3. 生成订单号
4. 创建订单记录

这应该用DomainService还是直接Repository？请实现正确的方案。
```

### 技巧3：指定模板

```
请使用admin/frontend/CODING_STANDARDS.md中的"Custom Hook标准模板"
来创建useOrderList Hook，包含：
- fetchItems
- createItem
- updateItem
- deleteItem
- 完整的状态管理
```

---

## 📋 快速参考表

| 任务 | 阅读文档 | 关键词 |
|------|---------|--------|
| **Admin后端API** | admin/README.md#ai-context | "Pragmatic DDD", "决策树" |
| **Admin前端CRUD** | admin/frontend/prompt.md | "三层架构", "文件<200行" |
| **Website后端API** | website/README.md#ai-context | "suspend", "禁止block()" |
| **Website前端页面** | website/frontend/WORKFLOW_CN.md | "Neubrutalism", "国际化" |
| **API格式** | docs/API_STANDARDS.md | "ApiResponse", "分页" |
| **故障排查** | docs/FAQ.md | 具体错误信息 |

---

## 💡 最佳实践

### ✅ 推荐做法

1. **先导航，后需求**
   ```
   第一步：请打开docs/AI_CONTEXT_INDEX.md，帮我定位应该修改哪个模块
   第二步：阅读该模块的AI Context
   第三步：实现我的需求...
   ```

2. **引用具体章节**
   ```
   参考admin/README.md#代码模板中的ApplicationService模板
   遵循admin/frontend/CODING_STANDARDS.md#table组件模板
   ```

3. **提供上下文文件**
   ```
   现有代码：admin/src/.../UserService.java
   请阅读这个文件，然后按相同风格添加新方法
   ```

### ❌ 避免做法

1. **不提供文档**
   ```
   ❌ "帮我创建一个用户管理模块"  # 太模糊
   ✅ "请先阅读admin/README.md，然后创建用户管理模块"
   ```

2. **忽略决策树**
   ```
   ❌ "用Repository实现"  # 可能错误
   ✅ "根据决策树，这个逻辑应该用DomainService还是Repository？"
   ```

3. **不指定规范**
   ```
   ❌ "创建一个前端页面"  # AI可能不遵循项目规范
   ✅ "按照CODING_STANDARDS.md的模板创建前端页面"
   ```

---

## 🎯 示例对话流程

### 完整示例：创建Product模块

**你**：
```
我想添加一个产品管理功能。
第一步：请先阅读docs/AI_CONTEXT_INDEX.md，告诉我应该在哪些模块添加代码。
```

**AI**：
```
根据AI_CONTEXT_INDEX.md：
需要修改2个模块：
1. Admin Backend - 创建Product API
2. Admin Frontend - 创建Product管理页面

下一步：我应该先读取这两个模块的AI Context吗？
```

**你**：
```
是的，请阅读：
1. admin/README.md#ai-context
2. admin/frontend/prompt.md

然后实现完整的Product CRUD功能。
```

**AI**：
```
已读取文档。我将按以下结构实现：

【后端】
- Entity: Product.java (JPA注解)
- Repository: ProductRepository.java
- Service: ProductApplicationService.java (直接用Repository，因为是简单CRUD)
- Controller: ProductController.java

【前端】
- features/product/ProductTable.tsx (纯展示)
- features/product/hooks/useProductList.ts (业务逻辑)
- features/product/components/ProductFormModal.tsx
- pages/ProductsPage.tsx (编排)

是否开始实现？
```

---

## 📚 总结

**记住3个步骤**：

1. **📖 先读文档** - 使用docs/AI_CONTEXT_INDEX.md快速定位
2. **🎯 提供上下文** - 明确告诉AI阅读哪个文档的哪个章节
3. **✅ 引用规范** - 明确要求遵循特定模板和决策树

**有了这套文档体系，AI就像有了项目的"大脑"，能够完全按照你的架构规范来工作！** 🚀
