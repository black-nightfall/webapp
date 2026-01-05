# Admin Frontend - 开发文档

> 后台管理系统前端 - React + TypeScript + Vite + Ant Design  
> **架构模式**: 业界标准三层架构 (pages/features/services)

> **📚 深入阅读**：本README为快速指南。  
> - 完整开发指南 → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)  
> - AI专用提示 → [prompt.md](./prompt.md)

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [架构设计](#架构设计) → [详见DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- [目录结构](#目录结构)
- [开发规范](#开发规范) → [详见DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- [常见问题](#常见问题)
- [相关文档](#相关文档)

---

## 项目概述

这是一个**企业级后台管理系统**前端项目，采用**业界标准的三层架构**。

**核心特性**：
- ✅ React 19 + TypeScript严格模式
- ✅ 三层架构（pages/features/services）
- ✅ Mock/Dev模式切换
- ✅ 文件大小<200行强制约束
- ✅ Props化组件设计

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.2.x | UI框架 |
| **TypeScript** | 5.9.x | 类型安全 |
| **Vite** | 7.x | 构建工具 |
| **Ant Design** | 6.x | 组件库 |
| **React Router** | 7.x | 路由管理 |
| **Axios** | 1.x | HTTP客户端 |

---

## 快速开始

### 环境要求
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 安装依赖
```bash
cd admin/frontend
npm install
```

### 开发模式

#### Mock模式（推荐用于前端开发）⭐
```bash
npm run dev -- --mode mock
```
- 无需启动后端
- 使用Mock数据
- 快速开发和调试

#### Dev模式（连接真实后端）
```bash
npm run dev
```
- 需要后端运行（`./gradlew :admin:bootRun`）
- 连接真实API

#### 生产构建
```bash
npm run build
```

### 访问地址
- 开发环境: http://localhost:5174
- 默认账号: `superadmin` / `admin123`

---

## 架构设计

### 三层架构概览

```
pages/ (编排层)
  ↓ 组合
features/ (组件层)
  ↓ 调用
services/ (API层)
```

**核心原则**：
- ✅ Pages **编排**组件和逻辑
- ✅ Features **纯展示**，通过Props接收数据
- ✅ Services **封装**API调用
- ❌ 禁止Features直接调用API

**详细说明** → [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 目录结构

```
admin/frontend/
├── src/
│   ├── pages/                  # 页面层
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── UsersPage.tsx       # ✅ 标准实现
│   │
│   ├── features/               # 功能层
│   │   ├── user/               # ✅ 标准结构
│   │   │   ├── UserTable.tsx
│   │   │   ├── components/
│   │   │   │   ├── UserFormModal.tsx
│   │   │   │   └── UserSearchForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useUserList.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── role/               # ✅ 标准结构
│   │   ├── product/            # ⚠️ 待重构
│   │   └── order/              # ⚠️ 待重构
│   │
│   ├── services/               # 服务层
│   │   ├── api.ts              # Axios实例
│   │   ├── userApi.ts
│   │   └── roleApi.ts
│   │
│   ├── components/             # 全局组件
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── contexts/               # 全局状态
│   │   └── AuthContext.tsx
│   │
│   ├── mocks/                  # Mock数据
│   │   ├── api.ts
│   │   └── data.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.mock                   # Mock环境配置
├── .env.development            # 开发环境配置
├── vite.config.ts
└── package.json
```

**重要说明**：
- ✅ **已重构**: `user/` 和 `role/` 采用标准三层架构
- ⚠️ **待重构**: `product/` 和 `order/` 仍使用旧模式

---

## 开发规范

### 核心规范速查

#### ✅ 必须遵守

1. **文件大小限制**
   ```
   ✅ 优秀：< 150行
   ⚠️ 可接受：150-200行
   ❌ 必须拆分：> 200行
   ```

2. **组件职责**
   ```typescript
   // ✅ 正确：纯展示组件
   export const UserTable: React.FC<Props> = ({ users, onEdit }) => {
       return <Table ... />;  // 无API调用，无业务逻辑
   };
   
   // ❌ 错误：组件内调用API
   export const UserTable = () => {
       useEffect(() => {
           api.get('/users').then(setUsers);  // 禁止！
       }, []);
   };
   ```

3. **路由规则**
   ```typescript
   // ✅ 正确：路由指向Page
   <Route path="/users" element={<UsersPage />} />
   
   // ❌ 错误：路由直接指向Feature
   <Route path="/users" element={<UserTable />} />
   ```

4. **类型定义**
   ```typescript
   // ✅ 必须：在types.ts中定义
   // features/user/types.ts
   export interface User { ... }
   
   // ❌ 禁止：组件内定义
   const UserTable = () => {
       interface User { ... }  // 禁止！
   };
   ```

#### 标准CRUD模块结构

**所有新模块必须遵循**：
```
features/xxx/
├── XxxTable.tsx          # 纯展示表格
├── components/
│   └── XxxFormModal.tsx  # 表单Modal
├── hooks/
│   └── useXxxList.ts     # 业务逻辑Hook
├── types.ts              # 类型定义
└── index.ts              # 统一导出
```

**参考标准实现**：
- `features/user/` - 用户模块
- `features/role/` - 角色模块

**完整规范** → [CODING_STANDARDS.md](./CODING_STANDARDS.md)

---

## 常见问题

### Q1: 如何切换Mock/Dev模式？

**Mock模式**（推荐用于前端开发）：
```bash
npm run dev -- --mode mock
```
- 使用 `.env.mock` 配置
- `VITE_API_MODE=mock`
- 无需后端

**Dev模式**（连接真实后端）：
```bash
npm run dev
```
- 使用 `.env.development` 配置
- `VITE_API_MODE=real`
- 需要后端运行

### Q2: 如何添加新的CRUD模块？

**步骤**：
1. 参考 `features/user/` 复制结构
2. 修改types.ts定义接口
3. 修改hooks/useXxxList.ts实现逻辑
4. 修改XxxTable.tsx和XxxFormModal.tsx
5. 创建XxxPage.tsx进行编排
6. 添加路由

**详细流程** → [CODING_STANDARDS.md](./CODING_STANDARDS.md)

### Q3: 组件超过200行怎么办？

**必须拆分！** 策略：
- 表格columns过长 → 提取到单独文件
- Modal过大 → 移到 `components/`
- Page过大 → 业务逻辑提取到Hook

### Q4: API调用返回401怎么办？

**检查**：
1. Token是否正确设置？查看 `services/api.ts` 请求拦截器
2. 用户名是否正确？应该是 `superadmin`（不是admin）
3. 后端是否运行？访问 `http://localhost:9090/admin/auth/login` 测试

### Q5: 如何处理分页？

**Ant Design使用1-indexed，后端使用0-indexed**：

```typescript
// 前端 → 后端（减1）
fetchUsers({ page: pagination.current - 1 });

// 后端 → 前端（加1）
<Table
    pagination={{
        current: data.number + 1,
        total: data.totalElements,
    }}
/>
```

### Q6: TypeScript报错怎么办？

**常见问题**：
- ❌ 使用了`any`类型 → 定义具体接口
- ❌ 缺少类型定义 → 在types.ts中添加
- ❌ 导入路径错误 → 检查相对路径

### Q7: 新人第一步做什么？

**建议任务**：创建一个简单的Product模块
- 只需3个字段：id, name, price
- 复制user模块的结构
- 实现列表展示和创建功能

**参考** → [CODING_STANDARDS.md](./CODING_STANDARDS.md#代码模板)

---

## 相关文档

### 本模块深入阅读
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 完整架构设计和最佳实践
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - 完整代码规范和模板
- **[prompt.md](./prompt.md)** - AI专用快速提示

### 后端文档
- **[admin/README.md](../README.md)** - Admin后端开发文档

### 项目级文档
- **[docs/AI_CONTEXT_INDEX.md](../../docs/AI_CONTEXT_INDEX.md)** - AI导航中心
- **[docs/AI_PROMPTING_GUIDE.md](../../docs/AI_PROMPTING_GUIDE.md)** - AI提示语指南
- **[docs/FAQ.md](../../docs/FAQ.md)** - 常见问题汇总
- **[QUICKSTART.md](../../QUICKSTART.md)** - 快速开始

---

**清晰架构，高效开发！** ✨
