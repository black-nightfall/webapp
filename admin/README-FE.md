# Admin 前端开发手册

## 目录结构

```
frontend/
├── src/
│   ├── components/                   # 公共组件
│   │   ├── ErrorBoundary.tsx       # 错误边界组件
│   │   └── ProtectedRoute.tsx      # 受保护路由组件
│   ├── contexts/                     # React上下文
│   │   └── AuthContext.tsx         # 认证上下文
│   ├── features/                     # 功能模块
│   │   ├── order/                  # 订单功能模块
│   │   │   └── OrderCreate.tsx
│   │   ├── product/                # 产品功能模块
│   │   │   └── ProductList.tsx
│   │   └── user/                   # 用户功能模块
│   │       └── UserList.tsx
│   ├── layouts/                      # 布局组件
│   │   └── AppLayout.tsx
│   ├── pages/                        # 页面组件
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── services/                     # API服务
│   │   └── api.ts
│   ├── App.tsx                       # 应用根组件
│   ├── index.css                     # 全局样式
│   └── main.tsx                      # 应用入口
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 开发规范

### 1. 技术栈
- **框架**: React 18+
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: CSS Modules 或 Tailwind CSS
- **状态管理**: React Context 或 Zustand
- **路由**: React Router

### 2. 组件规范
- 使用函数组件和Hooks
- 组件文件名采用PascalCase
- 使用TypeScript接口定义Props类型
- 遵循单一职责原则

### 3. API交互
- 使用统一的API服务层
- 所有API响应遵循后端 [ApiResponse](file:///Users/peigen/Documents/dev/peigen/webapp/common/src/main/kotlin/com/night/common/dto/ApiResponse.kt) 格式
- 实现错误处理和加载状态

### 4. 状态管理
- 使用Context进行全局状态管理
- 组件本地状态使用useState/useReducer
- 避免过度使用状态提升

## 禁止规则

### 1. 架构层面
- ❌ 组件直接访问API（应通过services层）
- ❌ 在组件中直接处理复杂业务逻辑
- ❌ 使用class组件（除非有特殊需求）

### 2. 数据处理
- ❌ 忽略后端API响应格式
- ❌ 不处理API错误情况
- ❌ 在多个组件中重复定义相同的类型

### 3. 性能优化
- ❌ 在渲染中创建新的函数或对象
- ❌ 不必要的状态更新
- ❌ 忽略React的性能优化建议

## 与后端接口规范

### 1. 认证
- 使用JWT Token进行认证
- Token存储在localStorage或httpOnly Cookie中
- 实现自动刷新Token机制

### 2. API端点
- 所有API端点以`/admin/api/`为前缀
- 遵循RESTful API设计原则
- 使用统一的错误码处理

### 3. 数据格式
- 请求/响应数据使用JSON格式
- 日期时间使用ISO 8601格式
- 分页数据遵循后端分页规范

## 开发流程

1. 创建新功能时，先在`features`目录下创建功能模块
2. 定义TypeScript接口对应后端DTO
3. 在`services/api.ts`中添加API方法
4. 创建组件并实现UI逻辑
5. 实现错误处理和加载状态
6. 添加必要的单元测试