# Admin Frontend - 代码规范

> **完整代码规范和模板参考**

## 📋 目录

本文档包含从 [README.md](./README.md) 拆分出的完整代码规范和模板。

**核心内容**：
- 严格规范（必须遵守）
- 推荐实践
- 代码模板
- 最佳实践示例

---

## 🚨 严格规范（必须遵守）

### 文件大小限制 ⚠️ 强制

```
✅ 优秀：< 150行
⚠️ 可接受：150-200行
❌ 需重构：200-400行（立即拆分）
🚨 禁止：> 400行（必须拆分）
```

### 标准CRUD模式 ⭐ 所有新功能必须遵循

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

---

## 📝 代码模板

> **AI/Vibecode提示**：以下模板可直接复制使用

### 1. Types定义模板

```typescript
// features/product/types.ts
export interface Product {
    id: number;
    name: string;
    price: number;
    createdAt: string;  // ISO 8601字符串
}

export interface CreateProductRequest {
    name: string;
    price: number;
}

export interface UpdateProductRequest {
    name?: string;
    price?: number;
}

export interface ProductSearchParams {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
```

### 2. Custom Hook标准模板

```typescript
// features/product/hooks/useProductList.ts
import { useState, useEffect } from 'react';
import { message } from 'antd';
import api from '@/services/api';
import type { Product, CreateProductRequest } from '../types';

export const useProductList = () => {
    // ===== 状态定义 =====
    const [currentPage, setCurrentPage] = useState(0);
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams, setSearchParams] = useState({});
    const [total, setTotal] = useState(0);

    // ===== CRUD操作 =====
    const createItem = async (data: CreateProductRequest) => {
        try {
            await api.post('/products', data);
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
            const response = await api.get('/products', { params });
            setItems(response.data.content);
            setTotal(response.data.totalElements);
        } catch (error) {
            message.error('加载失败');
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (id: number, data: any) => {
        try {
            await api.put(`/products/${id}`, data);
            message.success('更新成功');
            await fetchItems();
        } catch (error) {
            message.error('更新失败');
            throw error;
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            message.success('删除成功');
            await fetchItems();
        } catch (error) {
            message.error('删除失败');
        }
    };

    // ===== 初始加载 =====
    useEffect(() => {
        fetchItems();
    }, []);

    // ===== 返回值 =====
    return {
        items,
        loading,
        total,
        currentPage,
        pageSize,
        createItem,
        fetchItems,
        updateItem,
        deleteItem,
    };
};
```

### 3. Table组件模板

```typescript
// features/product/ProductTable.tsx
import React from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Product } from './types';

interface ProductTableProps {
    products: Product[];
    loading: boolean;
    pagination: TablePaginationConfig;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onChange: (pagination: any) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading,
    pagination,
    onEdit,
    onDelete,
    onChange,
}) => {
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

### 4. FormModal组件模板

```typescript
// features/product/components/ProductFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import type { Product } from '../types';

interface ProductFormModalProps {
    visible: boolean;
    mode: 'create' | 'edit';
    initialValues?: Product | null;
    onSubmit: (values: any) => Promise<void>;
    onCancel: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    visible,
    mode,
    initialValues,
    onSubmit,
    onCancel,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (mode === 'edit' && initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, mode, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={mode === 'create' ? '创建产品' : '编辑产品'}
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            okText="确定"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    label="产品名称"
                    rules={[
                        { required: true, message: '请输入产品名称' },
                        { max: 100, message: '名称最多100字符' },
                    ]}
                >
                    <Input placeholder="请输入产品名称" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="价格"
                    rules={[
                        { required: true, message: '请输入价格' },
                        { type: 'number', min: 0.01, message: '价格必须大于0' },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入价格"
                        precision={2}
                        min={0.01}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
```

### 5. Page编排模板

```typescript
// pages/ProductsPage.tsx
import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProductTable } from '@/features/product/ProductTable';
import { ProductFormModal } from '@/features/product/components/ProductFormModal';
import { useProductList } from '@/features/product/hooks/useProductList';
import type { Product } from '@/features/product/types';

export default function ProductsPage() {
    const {
        items,
        loading,
        total,
        currentPage,
        pageSize,
        createItem,
        updateItem,
        deleteItem,
        fetchItems,
    } = useProductList();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const handleCreate = () => {
        setModalMode('create');
        setCurrentProduct(null);
        setModalVisible(true);
    };

    const handleEdit = (product: Product) => {
        setModalMode('edit');
        setCurrentProduct(product);
        setModalVisible(true);
    };

    const handleSubmit = async (values: any) => {
        if (modalMode === 'create') {
            await createItem(values);
        } else if (currentProduct) {
            await updateItem(currentProduct.id, values);
        }
        setModalVisible(false);
    };

    const handleDelete = async (id: number) => {
        await deleteItem(id);
    };

    const handleTableChange = (pagination: any) => {
        fetchItems({
            page: (pagination.current || 1) - 1,
            size: pagination.pageSize,
        });
    };

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
                    创建产品
                </Button>
            </Space>

            <ProductTable
                products={items}
                loading={loading}
                pagination={{
                    current: currentPage + 1,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChange={handleTableChange}
            />

            <ProductFormModal
                visible={modalVisible}
                mode={modalMode}
                initialValues={currentProduct}
                onSubmit={handleSubmit}
                onCancel={() => setModalVisible(false)}
            />
        </div>
    );
}
```

---

## 更多规范

详细的命名规范、类型定义规范、导入导出规范等请参考：
- [README.md](./README.md#开发规范) - 核心规范速查
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构设计原则
- [prompt.md](./prompt.md) - AI专用精简版

---

**遵循规范，代码更优雅！** ✨
