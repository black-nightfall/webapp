# Frontend 新增编辑/修改页面开发流程

> **AI助手说明**：本文档是为AI代码助手设计的前端开发工作流指南。遵循此流程可以确保生成的代码符合项目的前端架构规范。

本文档指导开发者如何在现有业务模块（如 User、Product、Order）中新增编辑/修改页面。确保代码的一致性和可维护性。

## 🤖 AI使用指南

当用户请求"添加新的编辑页面"时，请按照以下步骤操作：

1. **分析需求**：明确编辑的是哪个业务实体、需要编辑哪些字段、验证规则是什么
2. **选择实现方式**：独立页面 vs 模态框/抽屉
3. **Inside-Out实现**：Mock数据 → Service → Component → Route
4. **验证运行**：在mock模式下测试页面功能
5. **提供总结**：说明创建/修改了哪些文件

---

## 项目结构概览

```
frontend/
├── src/
│   ├── features/              # 业务功能模块
│   │   ├── user/
│   │   │   ├── UserList.tsx   # 列表页面
│   │   │   └── UserEdit.tsx   # 编辑页面（新增）
│   │   ├── product/
│   │   └── order/
│   ├── pages/                 # 通用页面
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── services/              # API服务层
│   │   └── api.ts
│   ├── mocks/                 # Mock数据
│   │   ├── data.ts
│   │   └── api.ts
│   ├── components/            # 公共组件
│   ├── layouts/               # 布局组件
│   ├── contexts/              # Context提供者
│   └── App.tsx                # 路由配置
```

---

## 编辑页面开发流程（6步走）

### 前置分析：确定页面需求

在开始编码前，明确以下问题：
1. **编辑对象**: 编辑哪个业务实体？（User / Product / Order）
2. **展示方式**: 独立页面 vs 模态框/抽屉？
3. **编辑字段**: 需要编辑哪些字段？是否有只读字段？
4. **验证规则**: 必填项、格式验证、业务规则
5. **数据获取**: 如何获取要编辑的数据？（通过URL参数、状态传递）
6. **成功后行为**: 保存后返回列表？还是停留在当前页？

---

### Step 1: Mock数据层扩展

#### 1.1 扩展 Mock Data

**路径**: `src/mocks/data.ts`

**添加单条数据查询的Mock数据**（如果尚未实现）：

```typescript
// src/mocks/data.ts
export const mockUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', isActive: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', isActive: false },
    // ... 更多用户
];

// 如果需要，添加辅助函数
export const findUserById = (id: number) => {
    return mockUsers.find(user => user.id === id);
};
```

#### 1.2 扩展 Mock API Handler

**路径**: `src/services/api.ts`

**在 `mockApiHandler` 中添加 PUT 方法实现**：

```typescript
// src/services/api.ts - mockApiHandler.put 方法
async put<T>(url: string, data?: unknown): Promise<T> {
    console.log('📦 Mock PUT:', url, data);
    
    // Users
    if (url.match(/\/users\/\d+$/)) {
        const id = parseInt(url.split('/').pop() || '0');
        return mockApi.user.updateUser(id, data as any) as Promise<T>;
    }
    
    // Products
    if (url.match(/\/products\/\d+$/)) {
        const id = parseInt(url.split('/').pop() || '0');
        return mockApi.product.updateProduct(id, data as any) as Promise<T>;
    }
    
    throw new Error(`Mock API not implemented for PUT ${url}`);
}
```

#### 1.3 在 Mock API 中实现 Update 方法

**路径**: `src/mocks/api.ts`

```typescript
// src/mocks/api.ts
export const mockApi = {
    user: {
        // 现有方法...
        getUsers: () => Promise.resolve(mockUsers),
        getUserById: (id: number) => {
            const user = mockUsers.find(u => u.id === id);
            if (!user) {
                return Promise.reject(new Error('User not found'));
            }
            return Promise.resolve(user);
        },
        
        // 新增：更新用户
        updateUser: (id: number, userData: Partial<User>) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const index = mockUsers.findIndex(u => u.id === id);
                    if (index === -1) {
                        reject(new Error('User not found'));
                        return;
                    }
                    
                    // 更新数据（模拟）
                    mockUsers[index] = { ...mockUsers[index], ...userData };
                    resolve(mockUsers[index]);
                }, 500); // 模拟网络延迟
            });
        },
    },
    // product, order 同理...
};
```

---

### Step 2: 创建编辑页面组件

#### 2.1 确定页面类型

**选择1: 独立页面**（推荐用于复杂表单）
- 路由: `/users/:id/edit`
- 文件位置: `src/features/user/UserEdit.tsx`

**选择2: 模态框/抽屉**（推荐用于简单编辑）
- 在列表页面中嵌入
- 文件位置: `src/features/user/UserList.tsx`（修改现有文件）

下面以**独立页面**为例。

---

#### 2.2 创建编辑页面组件

**路径**: `src/features/user/UserEdit.tsx`（新建）

**完整示例**：

```typescript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Spin, Alert, Switch, message } from 'antd';
import api from '../../services/api';

interface User {
    id: number;
    name: string;
    email: string;
    isActive?: boolean;
}

interface UserFormData {
    name: string;
    email: string;
    isActive: boolean;
}

const UserEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [form] = Form.useForm<UserFormData>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // 获取用户数据
    useEffect(() => {
        if (!id) {
            setError('Invalid user ID');
            return;
        }
        fetchUser(parseInt(id));
    }, [id]);

    const fetchUser = async (userId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get<User>(`/users/${userId}`);
            setUser(data);
            // 填充表单
            form.setFieldsValue({
                name: data.name,
                email: data.email,
                isActive: data.isActive ?? true,
            });
        } catch (err) {
            setError('Failed to load user. Please try again.');
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: UserFormData) => {
        if (!id) return;

        setSubmitting(true);
        setError(null);
        try {
            await api.put(`/users/${id}`, values);
            message.success('User updated successfully');
            navigate('/users'); // 返回列表页
        } catch (err) {
            const errorMessage = 'Failed to update user. Please try again.';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error updating user:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const onCancel = () => {
        navigate('/users');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error && !user) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                action={
                    <Button size="small" onClick={onCancel}>
                        Back to List
                    </Button>
                }
            />
        );
    }

    return (
        <div style={{ maxWidth: 600 }}>
            <h2>Edit User</h2>

            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        { required: true, message: 'Please input user name!' },
                        { min: 2, message: 'Name must be at least 2 characters' },
                    ]}
                >
                    <Input placeholder="Enter user name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                    label="Active"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
                        Save
                    </Button>
                    <Button onClick={onCancel} disabled={submitting}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserEdit;
```

**关键点**：
- ✅ 使用 `useParams` 获取URL中的ID
- ✅ 使用 `useNavigate` 进行页面跳转
- ✅ 使用 `Form.useForm` 管理表单状态
- ✅ 加载状态、错误处理、提交状态分离
- ✅ 表单验证使用 Ant Design 的 `rules`
- ✅ 成功后跳转到列表页

---

### Step 3: 配置路由

#### 3.1 在 App.tsx 中添加路由

**路径**: `src/App.tsx`

```typescript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ... 其他导入

// 懒加载功能组件
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserList = lazy(() => import('./features/user/UserList'));
const UserEdit = lazy(() => import('./features/user/UserEdit')); // 新增
const ProductList = lazy(() => import('./features/product/ProductList'));
const OrderCreate = lazy(() => import('./features/order/OrderCreate'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
              
              {/* 用户路由 */}
              <Route
                path="users"
                element={<Suspense fallback={<LoadingFallback />}><UserList /></Suspense>}
              />
              <Route
                path="users/:id/edit"  // 新增编辑路由
                element={<Suspense fallback={<LoadingFallback />}><UserEdit /></Suspense>}
              />
              
              <Route path="products" element={<Suspense fallback={<LoadingFallback />}><ProductList /></Suspense>} />
              <Route path="orders" element={<Suspense fallback={<LoadingFallback />}><OrderCreate /></Suspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
```

**路由命名规范**：
- 列表页: `/users`
- 详情页: `/users/:id`
- 编辑页: `/users/:id/edit`
- 新建页: `/users/new`

---

### Step 4: 在列表页添加编辑入口

#### 4.1 修改列表页，添加操作列

**路径**: `src/features/user/UserList.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface User {
    id: number;
    name: string;
    email: string;
}

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get<User[]>('/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load users. Please try again.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (userId: number) => {
        navigate(`/users/${userId}/edit`);
    };

    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Actions', // 新增操作列
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record.id)}
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                action={
                    <Button size="small" danger onClick={fetchUsers}>
                        Retry
                    </Button>
                }
                style={{ marginBottom: 16 }}
            />
        );
    }

    return (
        <div>
            <h2>User List</h2>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default UserList;
```

**关键点**：
- ✅ 使用 `useNavigate` 进行编程式导航
- ✅ 在表格中添加 `Actions` 列
- ✅ 使用 Ant Design 的 `Space` 组件布局操作按钮
- ✅ 使用图标增强视觉效果

---

### Step 5: （可选）添加面包屑导航

如果需要更好的用户体验，可以在编辑页面添加面包屑：

```typescript
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

// 在 UserEdit.tsx 的 return 中添加
<Breadcrumb
    style={{ marginBottom: 16 }}
    items={[
        {
            href: '/',
            title: <HomeOutlined />,
        },
        {
            href: '/users',
            title: (
                <>
                    <UserOutlined />
                    <span>Users</span>
                </>
            ),
        },
        {
            title: 'Edit User',
        },
    ]}
/>
```

---

### Step 6: 测试验证

#### 6.1 在 Mock 模式下测试

```bash
# 确保在 mock 模式下运行
npm run dev -- --mode mock
```

#### 6.2 测试检查清单

- [ ] **页面加载**: 访问 `/users/1/edit`，页面是否正确加载？
- [ ] **数据获取**: 表单是否正确填充了用户数据？
- [ ] **表单验证**: 
  - [ ] 清空必填字段，是否显示错误？
  - [ ] 输入无效邮箱，是否显示格式错误？
- [ ] **提交功能**: 点击 Save，是否显示成功消息？
- [ ] **取消功能**: 点击 Cancel，是否返回列表页？
- [ ] **错误处理**: 如果访问不存在的ID（如 `/users/999/edit`），是否显示错误？
- [ ] **加载状态**: 数据加载时是否显示 Spinner？
- [ ] **提交状态**: 提交时按钮是否显示 loading 状态？

---

## 完整示例：为 Product 模块添加编辑页面

### Step 1: 扩展 Mock API

```typescript
// src/mocks/api.ts
export const mockApi = {
    product: {
        getProducts: () => Promise.resolve(mockProducts),
        getProductById: (id: number) => {
            const product = mockProducts.find(p => p.id === id);
            if (!product) {
                return Promise.reject(new Error('Product not found'));
            }
            return Promise.resolve(product);
        },
        updateProduct: (id: number, productData: Partial<Product>) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const index = mockProducts.findIndex(p => p.id === id);
                    if (index === -1) {
                        reject(new Error('Product not found'));
                        return;
                    }
                    mockProducts[index] = { ...mockProducts[index], ...productData };
                    resolve(mockProducts[index]);
                }, 500);
            });
        },
    },
};
```

### Step 2: 创建编辑组件

```typescript
// src/features/product/ProductEdit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Spin, Alert, message } from 'antd';
import api from '../../services/api';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductFormData {
    name: string;
    price: number;
}

const ProductEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm<ProductFormData>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchProduct(parseInt(id));
    }, [id]);

    const fetchProduct = async (productId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get<Product>(`/products/${productId}`);
            setProduct(data);
            form.setFieldsValue({
                name: data.name,
                price: data.price,
            });
        } catch (err) {
            setError('Failed to load product.');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: ProductFormData) => {
        if (!id) return;
        setSubmitting(true);
        setError(null);
        try {
            await api.put(`/products/${id}`, values);
            message.success('Product updated successfully');
            navigate('/products');
        } catch (err) {
            setError('Failed to update product.');
            message.error('Failed to update product.');
            console.error('Error updating product:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error && !product) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ maxWidth: 600 }}>
            <h2>Edit Product</h2>
            {error && <Alert message="Error" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 16 }} />}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        { required: true, message: 'Please input price!' },
                        { type: 'number', min: 0, message: 'Price must be positive' },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter price" prefix="$" precision={2} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
                        Save
                    </Button>
                    <Button onClick={() => navigate('/products')} disabled={submitting}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProductEdit;
```

### Step 3: 配置路由

```typescript
// src/App.tsx
const ProductEdit = lazy(() => import('./features/product/ProductEdit'));

// 在 Routes 中添加
<Route
    path="products/:id/edit"
    element={<Suspense fallback={<LoadingFallback />}><ProductEdit /></Suspense>}
/>
```

### Step 4: 修改列表页

```typescript
// src/features/product/ProductList.tsx
// 添加 Actions 列，参考上面 UserList 的实现
```

---

## 开发自检清单 (Checklist)

- [ ] **Mock数据**: 是否在 `src/mocks/data.ts` 中有对应的测试数据？
- [ ] **Mock API**: 是否在 `src/mocks/api.ts` 中实现了 `getById` 和 `update` 方法？
- [ ] **API Handler**: 是否在 `src/services/api.ts` 的 `mockApiHandler` 中添加了 PUT 路由？
- [ ] **组件创建**: 是否创建了编辑组件（如 `UserEdit.tsx`）？
- [ ] **路由配置**: 是否在 `App.tsx` 中添加了编辑路由？
- [ ] **列表入口**: 是否在列表页添加了"Edit"按钮？
- [ ] **表单验证**: 是否添加了必要的验证规则？
- [ ] **状态管理**: 是否正确处理了 loading、error、submitting 状态？
- [ ] **用户体验**: 
  - [ ] 是否有加载指示器？
  - [ ] 是否有错误提示？
  - [ ] 是否有成功消息？
  - [ ] 是否有取消按钮？
- [ ] **TypeScript**: 是否定义了正确的类型接口？
- [ ] **代码规范**: 是否遵循了现有代码的风格？

---

## 常见场景速查

### 场景1：使用模态框进行编辑（而非独立页面）

```typescript
// src/features/user/UserList.tsx
const [editModalVisible, setEditModalVisible] = useState(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);

const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
};

// 在 return 中添加
<Modal
    title="Edit User"
    open={editModalVisible}
    onCancel={() => setEditModalVisible(false)}
    footer={null}
>
    <Form
        initialValues={selectedUser}
        onFinish={(values) => {
            // 处理更新逻辑
            api.put(`/users/${selectedUser?.id}`, values).then(() => {
                message.success('Updated successfully');
                setEditModalVisible(false);
                fetchUsers(); // 刷新列表
            });
        }}
    >
        {/* 表单字段 */}
    </Form>
</Modal>
```

### 场景2：使用抽屉（Drawer）进行编辑

```typescript
import { Drawer } from 'antd';

<Drawer
    title="Edit User"
    placement="right"
    width={600}
    onClose={() => setDrawerVisible(false)}
    open={drawerVisible}
>
    {/* 编辑表单 */}
</Drawer>
```

### 场景3：在编辑页面中添加更多操作（如删除）

```typescript
// 在 UserEdit.tsx 中添加删除功能
const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        await api.delete(`/users/${id}`);
        message.success('User deleted successfully');
        navigate('/users');
    } catch (err) {
        message.error('Failed to delete user');
    }
};

// 在表单按钮区域添加
<Button danger onClick={handleDelete}>
    Delete
</Button>
```

### 场景4：编辑表单包含文件上传

```typescript
import { Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

const [fileList, setFileList] = useState<UploadFile[]>([]);

<Form.Item label="Avatar" name="avatar">
    <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
    >
        {fileList.length < 1 && '+ Upload'}
    </Upload>
</Form.Item>
```

### 场景5：编辑表单包含级联选择

```typescript
import { Cascader } from 'antd';

const categoryOptions = [
    {
        value: 'electronics',
        label: 'Electronics',
        children: [
            { value: 'phones', label: 'Phones' },
            { value: 'laptops', label: 'Laptops' },
        ],
    },
    // ...
];

<Form.Item label="Category" name="category">
    <Cascader options={categoryOptions} placeholder="Select category" />
</Form.Item>
```

---

## 与后端 API 对接清单

当 Mock 开发完成后，对接真实 API 时需要确认：

- [ ] **API端点**: 后端是否实现了 `GET /api/{resource}/{id}` 用于获取单条数据？
- [ ] **API端点**: 后端是否实现了 `PUT /api/{resource}/{id}` 用于更新数据？
- [ ] **请求格式**: 后端期望的请求体格式是否与前端一致？
- [ ] **响应格式**: 后端返回的数据格式是否与前端 Mock 数据一致？
- [ ] **错误处理**: 后端是否返回统一的错误格式（如 `ApiResponse`）？
- [ ] **权限验证**: 后端是否需要 JWT Token？前端的 `api.ts` 拦截器是否已配置？
- [ ] **CORS配置**: 后端是否正确配置了 CORS？

---

## 参考文档

- [后端API开发流程](./add-api-plan-flow.md) - 后端对应的API实现指南
- [Mock API使用指南](./frontend/MOCK_API_GUIDE.md) - Mock系统详细说明
- [React Router官方文档](https://reactrouter.com/) - 路由配置
- [Ant Design Form](https://ant.design/components/form) - 表单组件
- [Ant Design Table](https://ant.design/components/table) - 表格组件

---

## 快速开始模板

### 1. 编辑页面组件模板

```typescript
// src/features/{feature}/{Feature}Edit.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Spin, Alert, message } from 'antd';
import api from '../../services/api';

interface {Entity} {
    id: number;
    // ... 字段定义
}

const {Feature}Edit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch{Entity}(parseInt(id));
    }, [id]);

    const fetch{Entity} = async (entityId: number) => {
        setLoading(true);
        try {
            const data = await api.get<{Entity}>(`/{resource}/${entityId}`);
            form.setFieldsValue(data);
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        if (!id) return;
        setSubmitting(true);
        try {
            await api.put(`/{resource}/${id}`, values);
            message.success('Updated successfully');
            navigate('/{resource}');
        } catch (err) {
            message.error('Update failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
    if (error) return <Alert message="Error" description={error} type="error" />;

    return (
        <div style={{ maxWidth: 600 }}>
            <h2>Edit {Entity}</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* 表单字段 */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting}>Save</Button>
                    <Button onClick={() => navigate('/{resource}')} style={{ marginLeft: 8 }}>Cancel</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default {Feature}Edit;
```

### 2. Mock API Update 方法模板

```typescript
// src/mocks/api.ts
update{Entity}: (id: number, data: Partial<{Entity}>) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mock{Entities}.findIndex(e => e.id === id);
            if (index === -1) {
                reject(new Error('{Entity} not found'));
                return;
            }
            mock{Entities}[index] = { ...mock{Entities}[index], ...data };
            resolve(mock{Entities}[index]);
        }, 500);
    });
}
```

---

**记住核心原则**: 
1. **Outside-In**: Mock → Component → Route
2. **用户优先**: 加载状态、错误处理、成功反馈一个都不能少
3. **类型安全**: 充分利用 TypeScript 的类型检查
4. **保持一致**: 遵循现有代码的命名和结构规范
