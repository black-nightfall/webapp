# Admin 前端项目

> 基于 React + TypeScript + Vite + Ant Design 构建的现代化管理后台系统

## 📋 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [开发指南](#开发指南)
- [构建与部署](#构建与部署)
- [代码规范](#代码规范)
- [常见问题](#常见问题)

## 🛠 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.2.x | UI 框架 |
| TypeScript | 5.9.x | 类型系统 |
| Vite | 7.x | 构建工具 |
| Ant Design | 6.x | UI 组件库 |
| React Router | 7.x | 路由管理 |
| Axios | 1.x | HTTP 客户端 |
| ESLint | 9.x | 代码检查 |
| Prettier | 最新 | 代码格式化 |

## 📁 项目结构

```
admin/frontend/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 项目资源文件
│   ├── components/        # 公共组件
│   │   ├── ErrorBoundary.tsx    # 错误边界组件
│   │   └── ProtectedRoute.tsx   # 路由保护组件
│   ├── contexts/          # React Context
│   │   └── AuthContext.tsx      # 认证状态管理
│   ├── features/          # 功能模块（按业务划分）
│   │   ├── user/         # 用户管理
│   │   │   └── UserList.tsx
│   │   ├── product/      # 产品管理
│   │   │   └── ProductList.tsx
│   │   └── order/        # 订单管理
│   │       └── OrderCreate.tsx
│   ├── layouts/           # 布局组件
│   │   └── AppLayout.tsx
│   ├── pages/             # 页面组件
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── services/          # API 服务
│   │   └── api.ts        # Axios 配置和拦截器
│   ├── App.tsx           # 根组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── .prettierrc           # Prettier 配置
├── eslint.config.js      # ESLint 配置
├── tsconfig.app.json     # TypeScript 配置（应用）
├── tsconfig.node.json    # TypeScript 配置（Node）
├── vite.config.ts        # Vite 配置
├── nginx.conf            # Nginx 配置示例
└── package.json          # 项目依赖
```

### 目录说明

- **components/**: 可复用的通用组件
- **features/**: 按业务功能划分的模块，每个模块包含相关的组件、逻辑和样式
- **contexts/**: 全局状态管理（使用 React Context API）
- **services/**: API 请求封装，统一管理后端接口调用
- **layouts/**: 布局组件，定义页面的整体结构

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
cd admin/frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173)

### 默认登录凭据

```
用户名: admin
密码: admin123
```

## ⚙️ 环境配置

### 环境变量

项目使用 `.env` 文件管理不同环境的配置：

#### 开发环境 (`.env.development`)
```bash
VITE_API_BASE_URL=http://localhost:9090/admin
```

#### 生产环境 (`.env.production`)
```bash
VITE_API_BASE_URL=/admin
```

### 路径别名

项目配置了路径别名，简化导入路径：

```typescript
// 使用别名前
import api from '../../services/api';

// 使用别名后
import api from '@/services/api';
```

支持的别名：
- `@/` → `src/`
- `@/components/` → `src/components/`
- `@/features/` → `src/features/`
- `@/services/` → `src/services/`
- `@/contexts/` → `src/contexts/`
- `@/layouts/` → `src/layouts/`
- `@/pages/` → `src/pages/`

## 👨‍💻 开发指南

### 开发流程

1. **创建新功能模块**
   ```bash
   # 在 src/features/ 下创建新目录
   mkdir src/features/新功能
   ```

2. **编写组件**
   - 使用 TypeScript
   - 遵循函数式组件规范
   - 添加 loading 和 error 状态处理

3. **API 调用**
   ```typescript
   import api from '@/services/api';
   
   // GET 请求
   const data = await api.get<ResponseType>('/endpoint');
   
   // POST 请求
   const result = await api.post<ResponseType>('/endpoint', payload);
   ```

4. **添加路由**
   在 `App.tsx` 中配置路由：
   ```typescript
   const NewFeature = lazy(() => import('@/features/new/NewFeature'));
   
   <Route 
     path="new-feature" 
     element={
       <Suspense fallback={<LoadingFallback />}>
         <NewFeature />
       </Suspense>
     } 
   />
   ```

### 组件开发规范

#### 1. 组件模板

```typescript
import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import api from '@/services/api';

interface DataType {
  id: number;
  name: string;
}

const FeatureComponent: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<DataType[]>('/endpoint');
      setData(result);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={<Button onClick={fetchData}>Retry</Button>}
      />
    );
  }

  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
};

export default FeatureComponent;
```

#### 2. 状态管理原则

- 优先使用 **useState** 管理组件本地状态
- 跨组件共享状态使用 **Context API**
- 复杂状态逻辑考虑自定义 Hook

#### 3. 错误处理

所有异步操作必须包含：
- ✅ Loading 状态
- ✅ Error 状态
- ✅ 重试机制
- ✅ 用户友好的错误提示

### 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build            # 生产构建
npm run preview          # 预览生产构建

# 代码质量
npm run lint             # ESLint 检查
npm run format           # Prettier 格式化
npm run format:check     # 检查代码格式
npm run type-check       # TypeScript 类型检查
```

## 📦 构建与部署

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 部署方式

#### 1. Nginx 部署

使用提供的 `nginx.conf` 配置：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**部署步骤**：
```bash
# 1. 构建
npm run build

# 2. 复制文件到 Nginx 目录
cp -r dist/* /usr/share/nginx/html/

# 3. 重启 Nginx
nginx -s reload
```

#### 2. 与 Spring Boot 集成

将构建产物复制到后端静态资源目录：

```bash
# 构建前端
npm run build

# 复制到 Spring Boot
cp -r dist/* ../src/main/resources/static/
```

#### 3. Docker 部署

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建镜像
docker build -t admin-frontend .

# 运行容器
docker run -p 80:80 admin-frontend
```

## 📝 代码规范

### TypeScript 规范

1. **严格模式**：启用 `strict: true`
2. **类型定义**：所有变量、函数参数、返回值必须有明确类型
3. **接口优先**：使用 `interface` 而不是 `type`（除非需要联合类型）
4. **避免 any**：禁止使用 `any`，使用 `unknown` 或具体类型

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserList.tsx` |
| 函数 | camelCase | `fetchData()` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 接口 | PascalCase | `interface User {}` |
| 私有变量 | camelCase with _ | `_internalState` |

### Git 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能
git commit -m "feat: 添加用户管理模块"

# 修复
git commit -m "fix: 修复登录状态丢失问题"

# 文档
git commit -m "docs: 更新 README 部署说明"

# 样式
git commit -m "style: 格式化代码"

# 重构
git commit -m "refactor: 重构 API 服务层"

# 性能
git commit -m "perf: 优化列表渲染性能"

# 测试
git commit -m "test: 添加登录组件单元测试"
```

### 代码格式化

项目使用 **Prettier** 自动格式化代码：

```bash
# 格式化所有文件
npm run format

# 检查格式
npm run format:check
```

**规则**：
- 使用单引号
- 分号结尾
- 每行最大长度 100 字符
- 尾随逗号（ES5）
- 2 空格缩进

## ❓ 常见问题

### 1. 启动报错 "Cannot find module"

**解决方案**：
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. 路径别名不生效

确保 IDE 已正确配置 TypeScript，VSCode 需要重启。

### 3. API 请求 401 错误

检查：
1. Token 是否过期（清除 localStorage）
2. 后端服务是否正常运行
3. 环境变量 API 地址是否正确

### 4. 代码分割后路由白屏

确保：
1. 使用 `React.lazy` 和 `Suspense`
2. `fallback` 组件已正确配置
3. 检查浏览器控制台错误

### 5. 生产构建体积过大

优化建议：
- ✅ 使用代码分割（已实现）
- ✅ Tree shaking（Vite 自动）
- ⚡ 动态导入 Ant Design 图标
- ⚡ 配置 `manualChunks` 进一步拆分

## 📚 参考文档

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Ant Design 组件库](https://ant.design/)
- [React Router 文档](https://reactrouter.com/)

## 📄 许可证

[MIT License](../../../LICENSE)

---

**维护者**: 开发团队  
**最后更新**: 2025-12-25
