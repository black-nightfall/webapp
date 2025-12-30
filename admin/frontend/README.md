# Admin Frontend - 开发文档

> 后台管理系统前端 - React + TypeScript + Vite + Ant Design  
> **架构模式**: 业界标准三层架构 (pages/features/services)

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [架构设计](#架构设计) ⭐ **重要**
- [目录结构](#目录结构)
- [开发规范](#开发规范) ⭐ **AI必读**
- [常见开发场景](#常见开发场景)
- [Mock API](#mock-api)
- [构建与部署](#构建与部署)

---

## 项目概述

这是一个**企业级后台管理系统**前端项目，采用**业界标准的架构模式**（75%的后台管理系统采用）。


---

## 技术栈

### 核心技术
| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.2.x | UI框架 |
| **TypeScript** | 5.9.x | 类型安全 |
| **Vite** | 7.x | 构建工具 |
| **Ant Design** | 6.x | 组件库 |
| **React Router** | 7.x | 路由管理 |

### 状态管理
- **React Hooks** - 本地状态管理
- **Custom Hooks** - 业务逻辑封装
- **Context API** - 全局状态（如Auth）

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Mock Service** - Mock API

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
**优点**: 无需启动后端，使用Mock数据进行开发

#### 开发模式（连接真实后端）
```bash
npm run dev
```

#### 生产构建
```bash
npm run build
```

### 访问地址
- 开发: http://localhost:5173
- 默认账号: `admin` / `admin123`

---

### 🎯 新人第一步（重要！）

完成快速启动后，按以下步骤快速上手：

#### Step 1: 启动项目并浏览功能
```bash
npm run dev -- --mode mock
# 访问 http://localhost:5173
# 登录: admin / admin123
```

浏览现有功能：
- ✅ **用户管理** (`/users`) - 标准实现参考
- ✅ **角色管理** (`/roles`) - 标准实现参考

#### Step 2: 阅读参考代码（15分钟）

**用户模块** - 完整标准实现：
```bash
# 打开以下文件，理解架构
src/pages/UsersPage.tsx              # ← CRUD编排层
src/features/user/UserTable.tsx      # ← 纯展示组件
src/features/user/hooks/useUserList.ts  # ← 业务逻辑
src/features/user/components/UserFormModal.tsx  # ← 表单Modal
```

**关键理解点**：
- `UsersPage` 如何组合各个组件
- `UserTable` 如何通过props接收数据和事件
- `useUserList` 如何封装CRUD逻辑

#### Step 3: 尝试第一个任务（30分钟）

**任务**：创建一个简单的Product模块

要求：
- 只需3个字段：id、name、price
- 复制user模块的结构
- 实现列表展示和创建功能（更新删除可选）

**参考**：跳转到 [场景1: 新增CRUD功能模块](#场景1-新增crud功能模块-)

#### Step 4: 常见问题自查

遇到问题？先查看 [常见问题](#常见问题) 和 [新人常见错误](#新人常见错误) 章节。

---

## 架构设计

### 🎯 核心理念

本项目采用**三层架构**，这是75%后台管理系统采用的标准模式：

```
┌─────────────────────────────────────────────────┐
│  pages/ (页面层 - 编排层)                        │
│  ├─ UsersPage.tsx        ← 编排CRUD功能          │
│  └─ RolesPage.tsx        ← 组合多个组件          │
└─────────────────────────────────────────────────┘
                    ↓ 使用
┌─────────────────────────────────────────────────┐
│  features/ (功能层 - 组件层)                     │
│  ├─ user/                                        │
│  │  ├─ UserTable.tsx     ← 纯展示（无业务逻辑）  │
│  │  ├─ components/       ← Modal、SearchForm等   │
│  │  └─ hooks/            ← 业务逻辑封装          │
│  └─ role/                                        │
└─────────────────────────────────────────────────┘
                    ↓ 调用
┌─────────────────────────────────────────────────┐
│  services/ (服务层 - API层)                      │
│  ├─ api.ts               ← 通用API客户端         │
│  ├─ roleApi.ts           ← 角色API              │
│  └─ menuApi.ts           ← 菜单API              │
└─────────────────────────────────────────────────┘
```

### 设计原则

1. **单一职责** - 每个文件/组件只做一件事
2. **职责分离** - 页面编排、组件展示、业务逻辑三者完全分离
3. **高内聚低耦合** - 功能模块内部高度内聚，模块间松耦合
4. **可复用性** - 所有组件设计为可独立使用

### 为什么使用这种架构？

| 对比项 | 单文件模式 | 三层架构 |
|--------|-----------|---------|
| **可维护性** | ⚠️ 差（500+行） | ✅ 优（＜200行/文件） |
| **可复用性** | ❌ 低 | ✅ 高 |
| **团队协作** | ⚠️ 冲突多 | ✅ 并行开发 |
| **代码质量** | ⚠️ 混乱 | ✅ 清晰 |
| **测试难度** | ❌ 难 | ✅ 易 |

---

## 目录结构

```
src/
├── pages/                     # 📄 页面层 - CRUD编排
│   ├── Dashboard.tsx          # 仪表板
│   ├── Login.tsx              # 登录
│   ├── UsersPage.tsx          # ✅ 用户管理页面（标准模式）
│   └── RolesPage.tsx          # ✅ 角色管理页面（标准模式）
│
├── features/                  # 🎨 功能层 - 业务组件
│   ├── user/                  # ✅ 用户模块（已重构）
│   │   ├── UserTable.tsx      # 表格组件（纯展示）
│   │   ├── UserList.tsx       # ⚠️ 旧版本（待删除）
│   │   ├── components/        
│   │   │   ├── UserFormModal.tsx      # 创建/编辑Modal
│   │   │   └── UserSearchForm.tsx     # 搜索表单
│   │   ├── hooks/             
│   │   │   └── useUserList.ts # 业务逻辑Hook
│   │   ├── types.ts           # 类型定义
│   │   └── index.ts           # 统一导出
│   │
│   ├── role/                  # ✅ 角色模块（已重构）
│   │   ├── RoleTable.tsx      # 表格组件（纯展示）
│   │   ├── RoleList.tsx       # ⚠️ 旧版本（待删除）
│   │   ├── components/
│   │   │   ├── RoleFormModal.tsx
│   │   │   ├── RolePermissionModal.tsx
│   │   │   └── RoleSearchForm.tsx
│   │   ├── hooks/
│   │   │   └── useRoleList.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── product/               # ⚠️ 待重构（使用旧模式）
│   │   ├── ProductList.tsx
│   │   └── types.ts
│   │
│   └── order/                 # ⚠️ 待重构（使用旧模式）
│       ├── OrderCreate.tsx
│       └── types.ts
│
├── components/                # 🧩 共享组件
│   ├── ErrorBoundary.tsx
│   ├── LanguageSwitcher.tsx
│   └── ProtectedRoute.tsx
│
├── layouts/                   # 📐 布局
│   └── AppLayout.tsx          # 主布局（侧边栏+头部）
│
├── services/                  # 🔌 服务层 - API
│   ├── api.ts                 # 通用API客户端
│   ├── roleApi.ts             # 角色API
│   └── menuApi.ts             # 菜单API
│
├── contexts/                  # 🌐 全局状态
│   └── AuthContext.tsx
│
├── i18n/                      # 🌍 国际化
│   ├── index.ts
│   └── locales/
│       ├── en-US.json
│       └── zh-CN.json
│
├── mocks/                     # 🎭 Mock数据
│   ├── api.ts                 # Mock API处理器
│   └── data.ts                # Mock数据
│
├── App.tsx                    # 应用入口
└── main.tsx                   # React入口
```

### 📌 重要说明

- ✅ **已重构**: `user/` 和 `role/` 采用标准三层架构
- ⚠️ **待重构**: `product/` 和 `order/` 仍使用旧模式
- **新功能**: 必须采用标准架构模式

---

## 开发规范

### 🚨 严格规范（必须遵守 - AI必读）

#### 1. 文件大小限制 ⚠️ 强制
```
✅ 优秀：< 150行
⚠️ 可接受：150-200行
❌ 需重构：200-400行（立即拆分）
🚨 禁止：> 400行（必须拆分）
```

#### 2. 组件职责划分 🚨 关键

**严格禁止**的做法：
```typescript
// ❌ 错误示例1：路由直接指向feature组件
<Route path="/users" element={<UserList />} />  // 禁止！

// ❌ 错误示例2：在Table组件中调用API
export const UserTable = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        api.get('/users').then(setUsers);  // 禁止！表格不应调用API
    }, []);
    return <Table dataSource={users} />;
};

// ❌ 错误示例3：在组件内定义类型
const UserList = () => {
    interface User { ... }  // 禁止！应在types.ts中定义
    // ...
};
```

**正确的做法**：
```typescript
// ✅ 正确：通过page层编排
<Route path="/users" element={<UsersPage />} />

// ✅ 正确：Table组件纯展示
export const UserTable: React.FC<UserTableProps> = ({
    users,      // 通过props接收数据
    loading,
    onEdit,     // 通过props接收事件处理
    onDelete,
}) => {
    // 无useState, 无useEffect, 无API调用
    return <Table dataSource={users} ... />;
};

// ✅ 正确：类型定义在types.ts
import type { User } from './types';
```

#### 3. 标准CRUD模式 ⭐ 所有新功能必须遵循

```
feature/xxx/
├── XxxTable.tsx           # 表格（纯展示）
├── components/
│   ├── XxxFormModal.tsx   # 表单Modal（创建/编辑合并）
│   └── XxxSearchForm.tsx  # 搜索表单（可选）
├── hooks/
│   └── useXxxList.ts      # 业务逻辑Hook
├── types.ts               # 类型定义
└── index.ts               # 统一导出

pages/
└── XxxPage.tsx            # 页面编排
```

**参考示例**：
- ✅ `features/user/` - 完整标准实现
- ✅ `features/role/` - 完整标准实现

#### 4. 命名规范

**页面组件**：
```typescript
// ✅ 正确
pages/UsersPage.tsx
pages/RolesPage.tsx
pages/ProductsPage.tsx

// ❌ 错误
pages/User.tsx               // 太简略
pages/UserManagement.tsx     // 太冗长
pages/user-list.tsx          // 使用kebab-case
```

**功能组件**：
```typescript
// ✅ 正确 - 纯展示组件
features/user/UserTable.tsx
features/user/UserSearchForm.tsx

// ✅ 正确 - 业务逻辑Hook
features/user/hooks/useUserList.ts

// ❌ 错误
features/user/UserList.tsx   // 混合职责
features/user/user-table.tsx // 使用kebab-case
```

#### 5. 类型定义规范

**必须创建types.ts**：
```typescript
// features/user/types.ts
export interface User {
    id: number;
    username: string;
    email: string;
    // ...
}

export interface UserFormData {
    username: string;
    password?: string;
    // ...
}

export interface SearchParams {
    username?: string;
    email?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;  // 当前页码（0-indexed）
}
```

**与后端对接**：
```typescript
// ✅ 正确：字段名与后端保持一致
export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string;   // 后端返回ISO 8601字符串
    updatedAt?: string;  // 可选字段用?
}

// ❌ 错误：不要使用下划线（不符合TS规范）
export interface User {
    created_at: string;  // 应该是createdAt
}
```

**可选字段处理**：
```typescript
// 创建请求 - 所有必填
export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
}

// 更新请求 - 所有可选
export interface UpdateUserRequest {
    username?: string;
    password?: string;
    email?: string;
}

// 搜索请求 - 所有可选
export interface SearchUserRequest {
    username?: string;
    email?: string;
    isActive?: boolean;
}
```

**日期类型处理**：
```typescript
// ✅ 推荐：后端返回string，前端按需转换
export interface User {
    createdAt: string;  // ISO 8601字符串
}

// 显示时转换
<span>{new Date(user.createdAt).toLocaleString()}</span>

// ❌ 不推荐：定义为Date（JSON序列化问题）
export interface User {
    createdAt: Date;  // 避免使用
}
```

#### 6. 导入/导出规范

**每个feature必须有index.ts**：
```typescript
// features/user/index.ts
export { default as UserList } from './UserList';     // 旧版（兼容）
export { UserTable } from './UserTable';
export { UserFormModal } from './components/UserFormModal';
export { UserSearchForm } from './components/UserSearchForm';
export { useUserList } from './hooks/useUserList';
export type { User, UserFormData, SearchParams } from './types';
```

**使用方式**：
```typescript
// ✅ 正确 - 从feature导入
import { UserTable, useUserList } from '../features/user';

// ❌ 错误 - 直接导入文件（破坏封装）
import { UserTable } from '../features/user/UserTable';
```

---

### ⭐ 推荐规范（强烈建议）

#### 1. Hook命名规范
```typescript
// ✅ 正确
useUserList()    // 列表管理
useUserForm()    // 表单逻辑
useAuth()        // 认证

// ❌ 错误
getUserList()    // 不是Hook
userList()       // 不是Hook
UserList()       // 不是Hook
```

#### 2. Modal使用模式

**推荐：合并创建和编辑**
```typescript
// ✅ 推荐
<UserFormModal
    visible={visible}
    mode={mode}           // 'create' | 'edit'
    initialValues={user}  // 编辑时传入
    onSubmit={handleSubmit}
/>
```

**不推荐：分开的Modal**
```typescript
// ⚠️ 不推荐 - 导致代码重复
<CreateUserModal visible={...} />
<EditUserModal visible={...} />
```

#### 3. 错误处理

**在Hook中统一处理**：
```typescript
// ✅ 正确 - Hook处理错误
export const useUserList = () => {
    const createUser = async (data) => {
        try {
            await api.post('/users', data);
            message.success('创建成功');
        } catch (error) {
            message.error('创建失败');
            throw error;  // 抛出以便Page层处理
        }
    };
    return { createUser };
};
```

#### 4. 分页处理

**统一使用1-indexed**（Ant Design规范）：
```typescript
// ✅ 正确
<Table
    pagination={{
        current: currentPage + 1,  // 后端0-indexed → 前端1-indexed
        pageSize,
        total,
    }}
    onChange={(pagination) => {
        const page = (pagination.current || 1) - 1;  // 转回0-indexed
        fetchUsers({ page });
    }}
/>
```

#### 5. Custom Hook标准模板

**所有CRUD hook必须遵循此模板**：
```typescript
export const useXxxList = () => {
    // ===== 状态定义（按字母排序） =====
    const [currentPage, setCurrentPage] = useState(0);
    const [items, setItems] = useState<Xxx[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams, setSearchParams] = useState({});
    const [total, setTotal] = useState(0);

    // ===== CRUD操作（按Create/Read/Update/Delete顺序） =====
    const createItem = async (data: any) => {
        try {
            await api.post('/items', data);
            message.success('创建成功');
            await fetchItems();
        } catch (error) {
            message.error('创建失败');
            throw error;
        }
    };

    const fetchItems = async (params?: any) => {
        setLoading(true);
        try {
            const data = await api.get('/items', { params });
            setItems(data.content);
            setTotal(data.totalElements);
        } catch (error) {
            message.error('加载失败');
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (id: number, data: any) => {
        try {
            await api.put(`/items/${id}`, data);
            message.success('更新成功');
            await fetchItems();
        } catch (error) {
            message.error('更新失败');
            throw error;
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await api.delete(`/items/${id}`);
            message.success('删除成功');
            await fetchItems();
        } catch (error) {
            message.error('删除失败');
        }
    };

    // ===== 辅助方法 =====
    const search = (params: any) => {
        setSearchParams(params);
        fetchItems({ page: 0, ...params });
    };

    const resetSearch = () => {
        setSearchParams({});
        fetchItems({ page: 0 });
    };

    // ===== 初始加载 =====
    useEffect(() => {
        fetchItems();
    }, []);

    // ===== 返回值（状态在前，方法在后） =====
    return {
        // 状态
        items,
        loading,
        total,
        currentPage,
        pageSize,
        searchParams,
        // 方法
        createItem,
        fetchItems,
        updateItem,
        deleteItem,
        search,
        resetSearch,
    };
};
```

#### 6. Table Columns定义规范

**在Table组件内部定义columns**：
```typescript
export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading,
    pagination,
    onEdit,
    onDelete,
    onChange,
}) => {
    // ✅ 在组件内定义columns
    const columns: ColumnsType<Product> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: '产品名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => `¥${price.toFixed(2)}`,
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="link" 
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除此产品？"
                        description="此操作不可恢复"
                        onConfirm={() => onDelete(record.id)}
                        okText="删除"
                        cancelText="取消"
                        okType="danger"
                    >
                        <Button 
                            type="link" 
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={onChange}
        />
    );
};
```

---

### 💡 最佳实践

#### 1. 组件Props设计

**纯展示组件** - 通过Props接收所有数据：
```typescript
// ✅ 优秀设计
interface UserTableProps {
    users: User[];           // 数据
    loading: boolean;        // 状态
    pagination: {...};       // 配置
    onEdit: (user) => void;  // 事件
    onDelete: (id) => void;
    onChange: (...) => void;
}
```

#### 2. 状态管理层级

```
全局状态（Context）
├─ 认证状态（AuthContext）
└─ 主题配置（ThemeContext）

页面状态（Page组件）
├─ Modal显示状态
└─ 选中的数据

Feature状态（Hook）
├─ 列表数据
├─ Loading状态
└─ CRUD操作

组件状态（Component）
└─ UI交互状态（如折叠展开）
```

#### 3. 代码复用优先级

```
1. 共享组件（components/）    ← 全局复用
2. Feature组件（features/）    ← Feature内复用
3. Page内联                    ← 页面特定
```

---

## API规范

### Endpoint格式

**统一前缀**：`/admin`（已在`services/api.ts`配置）

所有API调用会自动添加此前缀，代码中**无需**重复写。

**资源路径规范**：
```typescript
// ✅ 正确格式
GET    /users              // 获取用户列表
GET    /users/{id}         // 获取用户详情
POST   /users              // 创建用户
PUT    /users/{id}         // 更新用户
DELETE /users/{id}         // 删除用户
GET    /users/search       // 搜索用户（如需复杂查询）

// ❌ 错误格式
GET    /admin/users        // 不要重复/admin前缀
GET    /getUserList        // 不要使用动词
GET    /user-list          // 不要使用连字符
POST   /createUser         // 不要使用动词
```

### 在代码中使用

#### 方式1: 直接在Hook中调用（推荐）
```typescript
// features/user/hooks/useUserList.ts
export const useUserList = () => {
    const fetchUsers = async () => {
        const data = await api.get('/users');  // ✅ 自动添加/admin前缀
        setUsers(data);
    };
    
    const createUser = async (userData) => {
        await api.post('/users', userData);    // ✅
    };
};
```

#### 方式2: 创建专用API文件（大型项目）
```typescript
// services/userApi.ts
export const userApi = {
    getAll: () => api.get('/users'),
    getById: (id: number) => api.get(`/users/${id}`),
    create: (data: any) => api.post('/users', data),
    update: (id: number, data: any) => api.put(`/users/${id}`, data),
    delete: (id: number) => api.delete(`/users/${id}`),
};

// 在Hook中使用
const fetchUsers = async () => {
    const data = await userApi.getAll();
    setUsers(data);
};
```

### 请求/响应格式

**统一响应格式**：
```typescript
// 后端返回格式（通过common模块的ApiResponse）
{
    "success": true,
    "data": { ... },        // 或 [...] 数组
    "message": "操作成功",
    "code": 200
}

// 错误响应
{
    "success": false,
    "message": "错误信息",
    "code": 400
}
```

**在代码中处理**：
```typescript
// api.ts 已自动处理，Hook中直接使用data
const fetchUsers = async () => {
    try {
        const data = await api.get('/users');  // ✅ 已经是解析后的data
        setUsers(data);
    } catch (error) {
        message.error('加载失败');  // ✅ 错误已被拦截
    }
};
```

### 分页查询参数

```typescript
// ✅ 标准分页格式
GET /users?page=0&size=10&sortBy=createdAt&sortDirection=DESC

// 在代码中构建
const fetchUsers = async (page = 0, size = 10) => {
    const params = {
        page,
        size,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
    };
    const data = await api.get('/users', { params });
};
```

---

## 常见开发场景

### 场景1: 新增CRUD功能模块 ⭐ 最常见

#### 快速开始模板

1. **创建目录**：
```bash
mkdir -p src/features/product/{components,hooks}
mkdir src/pages
```

2. **复制模板**（从user或role复制）：
```bash
# 复制并重命名
cp -r src/features/user src/features/product
# 批量替换 User→Product, user→product
```

3. **修改文件**：
- `ProductTable.tsx` - 修改columns定义
- `ProductFormModal.tsx` - 修改表单字段
- `useProductList.ts` - 修改API endpoint
- `types.ts` - 定义Product类型

4. **创建页面**：
```typescript
// pages/ProductsPage.tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProductTable } from '../features/product/ProductTable';
import { ProductFormModal } from '../features/product/components/ProductFormModal';
import { useProductList } from '../features/product/hooks/useProductList';

const ProductsPage: React.FC = () => {
    const { products, loading, createProduct, updateProduct, deleteProduct } = useProductList();
    const [formModal, setFormModal] = useState({ visible: false, mode: 'create', product: null });
    
    return (
        <div>
            <h2>Product Management</h2>
            <Button onClick={() => setFormModal({ visible: true, mode: 'create', product: null })}>
                <PlusOutlined /> Create
            </Button>
            <ProductTable
                products={products}
                loading={loading}
                onEdit={(p) => setFormModal({ visible: true, mode: 'edit', product: p })}
                onDelete={(id) => deleteProduct(id)}
            />
            <ProductFormModal
                visible={formModal.visible}
                mode={formModal.mode}
                initialValues={formModal.product}
                onSubmit={async (values) => {
                    formModal.mode === 'create' 
                        ? await createProduct(values)
                        : await updateProduct(formModal.product.id, values);
                    setFormModal({ visible: false, mode: 'create', product: null });
                }}
                onCancel={() => setFormModal({ visible: false, mode: 'create', product: null })}
            />
        </div>
    );
};

export default ProductsPage;
```

5. **添加路由**：
```typescript
// App.tsx
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
<Route path="products" element={<ProductsPage />} />
```

---

### 场景2: 添加复杂Modal（权限分配型）

参考 `RolePermissionModal.tsx`：
```typescript
// 特点：
// 1. 独立的数据加载
// 2. Tree选择
// 3. 成功回调
```

---

### 场景3: 添加搜索功能

**简单搜索**（1-3个字段）：
```typescript
// 创建 XxxSearchForm.tsx
<Input onPressEnter={handleSearch} />
<Button onClick={handleSearch}>Search</Button>
```

**复杂搜索**（4+字段）：
```typescript
// 内联在Page中
<Form onFinish={handleSearch}>
    <Row gutter={16}>
        <Col span={6}><Input name="name" /></Col>
        <Col span={6}><Select name="status" /></Col>
        {/* 更多字段 */}
    </Row>
</Form>
```

---

## Mock API

### 模式切换

```bash
# Mock模式（推荐用于前端开发）
npm run dev -- --mode mock

# 开发模式（连接真实后端）
npm run dev
```

### Mock模式工作原理

**重要**：理解Mock原理有助于快速开发和调试。

#### 运行流程

当执行 `npm run dev -- --mode mock` 时：

1. **环境变量加载**：
   - Vite读取 `.env.mock` 文件
   - `VITE_API_MODE=mock` 被设置

2. **API拦截**：
   - `src/services/api.ts` 检测到mock模式
   - 所有`api.get()`, `api.post()`等调用被重定向到`src/mocks/api.ts`

3. **Mock响应**：
   - `src/mocks/api.ts` 根据请求路径返回`src/mocks/data.ts`中的数据
   - 模拟真实API的延迟和响应格式

#### 文件说明

```
.env.mock              # Mock模式配置
src/
├── services/
│   └── api.ts         # 检测VITE_API_MODE，决定使用mock还是真实API
└── mocks/
    ├── data.ts        # Mock数据定义
    └── api.ts         # Mock API处理器
```

### 切换到真实后端

**步骤**：
1. 启动后端服务（见 `../../README.md`）
2. 确认后端运行在 `http://localhost:8080`
3. 运行前端：`npm run dev`（不加`--mode mock`）
4. API请求会发送到 `.env.development` 中配置的 `VITE_API_BASE_URL`

### Mock数据结构

```
src/mocks/
├── data.ts      # 数据定义
│   ├── mockUsers
│   ├── mockRoles
│   └── mockProducts
│
└── api.ts       # API处理器
    ├── GET /users
    ├── POST /users
    └── ...
```

### 添加新的Mock

```typescript
// mocks/data.ts
export const mockProducts = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
];

// mocks/api.ts
export const mockApi = {
    'GET /products': () => ({
        success: true,
        data: mockProducts,
    }),
    
    'POST /products': (body: any) => {
        const newProduct = {
            id: mockProducts.length + 1,
            ...body,
            createdAt: new Date().toISOString(),
        };
        mockProducts.push(newProduct);
        return { success: true, data: newProduct };
    },
};
```

---

## 构建与部署

### 构建

```bash
npm run build
```

输出到 `dist/` 目录。

### 部署方式

#### 1. Nginx
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }
    location /api/ {
        proxy_pass http://backend:8080/;
    }
}
```

#### 2. Spring Boot集成
```bash
npm run build
cp -r dist/* ../src/main/resources/static/
```

---

## 常见问题

### Q1: 何时拆分组件？
**A**: 文件超过200行时立即拆分。优先拆分Modal、SearchForm。

### Q2: Feature和Page的区别？
**A**: 
- Feature = 可复用组件（UserTable可用于多处）
- Page = 页面容器（UsersPage只用于/users路由）

### Q3: 何时用Modal vs 独立页面？
**A**:
- 简单CRUD（<10字段） → Modal ✅
- 复杂表单、富文本编辑 → 独立页面

### Q4: 如何确保AI生成符合规范的代码？
**A**: 
1. 让AI先阅读本README的"开发规范"部分
2. 提供参考：`features/user/` 或 `features/role/`
3. 要求AI：一定要遵循三层架构，禁止超过200行

---

### 新人常见错误 🔧

#### 错误1: 启动报错 "Cannot find module"

**症状**：
```
Error: Cannot find module '@/features/user'
或
Module not found: Can't resolve 'antd'
```

**解决方案**：
```bash
# 删除依赖并重新安装
rm -rf node_modules package-lock.json
npm install

# 如果仍有问题，清理缓存
rm -rf node_modules/.vite
npm install
```

#### 错误2: Mock模式下API不工作

**症状**：
- 点击按钮没有反应
- 控制台报404错误
- 数据一直loading

**检查清单**：
```bash
# 1. 确认使用了正确的启动命令
npm run dev -- --mode mock  # ✅ 注意 -- --mode

# 2. 检查.env.mock文件存在
ls -la .env.mock

# 3. 检查mocks/api.ts中是否定义了该API
# 例如：'GET /users' 应该在mockApi对象中
```

**示例**：
```typescript
// ✅ 正确：在mocks/api.ts中定义
export const mockApi = {
    'GET /users': () => ({
        success: true,
        data: mockUsers,
    }),
};

// ❌ 错误：拼写错误
export const mockApi = {
    'GET /user': () => ({  // 注意：缺少s
        ...
    }),
};
```

#### 错误3: TypeScript类型错误

**症状**：
```
Property 'xxx' does not exist on type 'User'
Type 'User[]' is not assignable to type 'never[]'
```

**解决方案**：
```typescript
// ✅ 确保在types.ts中定义了类型
// features/user/types.ts
export interface User {
    id: number;
    username: string;
    email: string;
}

// ✅ 正确导入
import type { User } from './types';

// ✅ 使用泛型
const [users, setUsers] = useState<User[]>([]);  // 不是 []

// ❌ 错误：没有指定类型
const [users, setUsers] = useState([]);  // TypeScript推断为never[]
```

#### 错误4: 路由404

**症状**：
- 访问 `/users` 显示404
- 刷新页面后白屏

**检查清单**：
```typescript
// 1. App.tsx中是否添加了路由
const UsersPage = lazy(() => import('./pages/UsersPage'));
<Route path="users" element={<UsersPage />} />  // ✅ 注意：不要加/

// 2. 侧边栏菜单key是否匹配
const menuItems = [
    {
        key: '/users',  // ✅ 与路由一致
        label: '用户管理',
    },
];

// ❌ 错误的路由定义
<Route path="/users" element={<UsersPage />} />  // 会导致/admin/users/users
```

#### 错误5: 组件内调用API（违反架构）

**症状**：
```typescript
// ❌ 错误：在Table组件中直接调用API
export const UserTable = () => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        api.get('/users').then(setUsers);  // 违反架构！
    }, []);
    
    return <Table dataSource={users} />;
};
```

**解决方案**：
```typescript
// ✅ 正确：Table组件纯展示
export const UserTable: React.FC<UserTableProps> = ({
    users,    // 通过props接收
    loading,
}) => {
    return <Table dataSource={users} loading={loading} />;
};

// ✅ 在Hook中调用API
export const useUserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    
    const fetchUsers = async () => {
        const data = await api.get('/users');
        setUsers(data);
    };
    
    return { users, fetchUsers };
};

// ✅ 在Page中组合
const UsersPage = () => {
    const { users, loading, fetchUsers } = useUserList();
    
    return <UserTable users={users} loading={loading} />;
};
```

#### 错误6: 分页参数错误

**症状**：
- 切换页码后显示错误的数据
- 后端返回空数据

**原因**：前后端分页索引不一致
```typescript
// ❌ 错误：直接使用Ant Design的current（1-indexed）
onChange={(pagination) => {
    fetchUsers({ page: pagination.current });  // 后端需要0-indexed
}}

// ✅ 正确：转换索引
<Table
    pagination={{
        current: currentPage + 1,  // 后端0转前端1
    }}
    onChange={(pagination) => {
        const page = (pagination.current || 1) - 1;  // 前端1转后端0
        fetchUsers({ page });
    }}
/>
```

#### 调试技巧

1. **查看Network请求**：
   - 打开Chrome DevTools → Network
   - 检查API请求路径、参数、响应

2. **查看Console日志**：
   - Hook中的error会打印到console
   - 查看是否有类型错误、API错误

3. **使用React DevTools**：
   - 检查组件props是否正确传递
   - 查看Hook的返回值

4. **对比参考代码**：
   - 遇到问题时，对比`features/user/`的实现
   - 检查是否遗漏了某个步骤

---

## 参考资源

- [用户模块参考](./src/features/user/) - 完整标准实现 ✅
- [角色模块参考](./src/features/role/) - 完整标准实现 ✅
- [Ant Design](https://ant.design/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 维护者

**开发团队**  
**最后更新**: 2025-12-28  
**架构版本**: v2.0（三层架构标准化）

---

## 📌 重要提醒（AI必读）

### 生成代码时必须遵守以下规则：

1. ✅ **必须**采用三层架构（pages/features/hooks）
2. ✅ **必须**创建types.ts定义类型
3. ✅ **必须**保持文件<200行
4. ✅ **必须**参考user或role模块的实现
5. ❌ **禁止**在Table组件中调用API
6. ❌ **禁止**路由直接指向feature组件
7. ❌ **禁止**在组件内定义类型

### 标准开发流程

```
1. 创建types.ts → 定义类型
2. 创建hooks/useXxxList.ts → 业务逻辑
3. 创建XxxTable.tsx → 纯展示
4. 创建components/XxxFormModal.tsx → 表单
5. 创建pages/XxxPage.tsx → 编排
6. 更新App.tsx → 路由
```
