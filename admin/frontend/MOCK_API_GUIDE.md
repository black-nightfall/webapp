# Mock API 使用指南

## 📋 概述

本项目支持三种API模式：
- **Mock模式**：使用本地Mock数据，完全不连接后端
- **开发模式**：连接本地开发服务器 (http://localhost:9090)
- **生产模式**：连接生产环境API

---

## 🚀 快速开始

### 1. Mock模式运行（无需后端）

```bash
# 使用Mock环境
npm run dev -- --mode mock

# 或者临时设置环境变量
VITE_API_MODE=mock npm run dev
```

**使用场景**：
- ✅ 前端独立开发
- ✅ 后端API未就绪
- ✅ 演示和测试UI交互

**Mock账号**：
- 用户名：`admin`
- 密码：`admin123`

---

### 2. 开发模式（连接真实后端）

```bash
# 默认开发模式
npm run dev

# 或显式设置
VITE_API_MODE=real npm run dev
```

**前提条件**：
- 后端服务运行在 `http://localhost:9090`

---

### 3. 生产模式

```bash
npm run build
npm run preview
```

---

## ⚙️ 环境配置

### .env.development（开发环境）
```env
VITE_API_MODE=real           # real | mock
VITE_API_BASE_URL=/api
```

### .env.mock（纯Mock环境）
```env
VITE_API_MODE=mock
VITE_API_BASE_URL=/mock-api
```

### .env.production（生产环境）
```env
VITE_API_MODE=real
VITE_API_BASE_URL=/admin
```

---

## 🔄 在开发中快速切换

### 方法1: 修改 `.env.development`
```env
# 切换到Mock模式
VITE_API_MODE=mock

# 切换回真实API
VITE_API_MODE=real
```
保存后刷新浏览器即可。

### 方法2: 使用命令行参数
```bash
# 临时使用Mock
npm run dev -- --mode mock

# 使用development配置
npm run dev
```

---

## 📦 Mock数据说明

### 当前Mock数据

#### 用户 (Users)
- 3个预设用户
- 支持搜索、分页

#### 商品 (Products)
- 3个预设商品
- 支持基本CRUD

#### 订单 (Orders)
- 3个预设订单
- 支持不同状态

### 数据文件位置
- **Mock数据定义**: `src/mocks/data.ts`
- **Mock API实现**: `src/mocks/api.ts`
- **API切换逻辑**: `src/services/api.ts`

---

## 🛠️ 扩展Mock API

### 添加新的Mock端点

1. **添加Mock数据** (`src/mocks/data.ts`)
```typescript
export const mockCategories = [
    { id: 1, name: 'Electronics' },
    // ...
];
```

2. **实现Mock API** (`src/mocks/api.ts`)
```typescript
export const mockCategoryApi = {
    async getCategories() {
        await delay();
        return createSuccessResponse(mockCategories);
    },
};
```

3. **添加路由** (`src/services/api.ts`)
```typescript
// 在 mockApiHandler.get 中添加
if (url === '/categories') {
    return mockApi.category.getCategories() as Promise<T>;
}
```

---

## 🐛 调试技巧

### 查看API模式

打开浏览器控制台，会看到：
```
🔧 API Mode: mock
🌐 API Base URL: /mock-api
✅ Using Mock API
```

或

```
🔧 API Mode: real
🌐 API Base URL: /api
✅ Using Real API
```

### Mock请求日志

所有Mock请求会在控制台显示：
```
📦 Mock GET: /users
📦 Mock POST: /auth/login {username: 'admin', password: '***'}
```

---

## ✅ 功能对比

| 功能 | Mock模式 | 真实API模式 |
|------|----------|-------------|
| **登录** | ✅ admin/admin123 | ✅ 后端验证 |
| **用户管理** | ✅ 完整CRUD | ✅ 完整CRUD |
| **用户搜索** | ✅ 支持分页 | ✅ 支持分页 |
| **商品管理** | ✅ 基本CRUD | ✅ 完整CRUD |
| **订单管理** | ✅ 基本CRUD | ✅ 完整CRUD |
| **数据持久化** | ❌ 刷新丢失 | ✅ 数据库持久化 |
| **需要后端** | ❌ | ✅ |

---

## 📝 注意事项

1. **Mock数据不持久化**
   - Mock数据存储在内存中
   - 刷新页面后重置为初始数据

2. **Mock延迟模拟**
   - 默认500ms延迟模拟网络请求
   - 可在 `src/mocks/api.ts` 中调整

3. **环境切换需重启**
   - 修改 `.env` 文件后需要重启开发服务器
   - 使用 `--mode` 参数时无需重启

4. **生产环境强制真实API**
   - 生产构建会忽略Mock设置
   - 确保 `.env.production` 中 `VITE_API_MODE=real`

---

## 🔧 故障排查

### 问题1: Mock模式不生效
**解决**：
1. 检查 `.env` 文件中的 `VITE_API_MODE`
2. 重启开发服务器 `npm run dev`
3. 清除浏览器缓存并刷新

### 问题2: 看不到控制台日志
**解决**：
1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 查看 "🔧 API Mode" 日志

### 问题3: Mock API未实现错误
**解决**：
检查请求的URL是否在 `src/services/api.ts` 的 `mockApiHandler` 中定义。

---

## 🎯 推荐开发流程

1. **前期开发**：使用Mock模式快速搭建UI
2. **集成测试**：切换到真实API验证前后端对接
3. **联调阶段**：真实API + 后端并行开发
4. **上线前**：真实API全面测试

---

**提示**：Mock模式下，右上角用户名会显示 "admin"（来自Mock数据）
