# AI/Vibecode Prompt - Admin Frontend

> **For AI Agents**: Admin后台前端Vibe Coding快速指南

## 🎯 Role

你是精通 **React 19 + TypeScript 5 + Vite + Ant Design** 的高级前端工程师。

## 📋 Core Context

### 架构模式
**三层架构** (业界标准后台管理系统模式)

```
pages/ (编排层)
  → features/ (组件层)
      → services/ (API层)
```

### 技术栈
- React 19.2.x
- TypeScript 5.9.x (Strict Mode)
- Vite 7.x
- Ant Design 6.x
- React Router 7.x

### 强制规则 ⚠️

```
✅ 必须遵守:
  - 文件大小 < 200行
  - 组件必须Props化（通过props接收数据和事件）
  - 类型必须在types.ts定义
  - API调用必须在Service层

❌ 严格禁止:
  - 文件 > 200行
  - 组件内部调用API（useState + useEffect + fetch）
  - 使用any类型
  - 路由直接指向feature组件
  - 在组件内定义类型
```

---

## 🎨 Code Templates

### 1. CRUD模块标准结构

```
features/product/
├── ProductTable.tsx          # 纯展示表格
├── components/
│   ├── ProductFormModal.tsx  # 表单Modal（创建+编辑合并）
│   └── ProductSearchForm.tsx # 搜索表单
├── hooks/
│   └── useProductList.ts     # 业务逻辑Hook
├── types.ts                  # 类型定义
└── index.ts                  # 统一导出

pages/
└── ProductsPage.tsx          # 编排层
```

### 2. Types定义模板

```typescript
// features/product/types.ts
export interface Product {
    id: number;
    name: string;
    price: number;
    createdAt: string;  // ISO 8601
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
```

### 3. Custom Hook模板

```typescript
// features/product/hooks/useProductList.ts
export const useProductList = () => {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const fetchItems = async (params?: any) => {
        setLoading(true);
        try {
            const data = await api.get('/products', { params });
            setItems(data.content);
            setTotal(data.totalElements);
        } catch (error) {
            message.error('加载失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    return { items, loading, total, fetchItems };
};
```

### 4. 纯展示Table模板

```typescript
// features/product/ProductTable.tsx
interface ProductTableProps {
    products: Product[];
    loading: boolean;
    pagination: TablePaginationConfig;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onChange: (pagination: any) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products, loading, pagination, onEdit, onDelete, onChange
}) => {
    const columns: ColumnsType<Product> = [
        { title: 'ID', dataIndex: 'id', width: 70 },
        { title: '名称', dataIndex: 'name' },
        {
            title: '操作',
            key: 'actions',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => onEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除？"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Button type="link" danger>删除</Button>
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

### 5. Page编排模板

```typescript
// pages/ProductsPage.tsx
export default function ProductsPage() {
    const { items, loading, total, fetchItems } = useProductList();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setModalVisible(true);
    };

    return (
        <div>
            <ProductTable
                products={items}
                loading={loading}
                onEdit={handleEdit}
                // ... 其他props
            />
            <ProductFormModal
                visible={modalVisible}
                initialValues={currentProduct}
                // ... 其他props
            />
        </div>
    );
}
```

---

## 🧭 Decision Rules

### 新增CRUD模块流程

```
1. 创建types.ts
   └─ 定义: Interface (Entity, Request, Response)

2. 创建hooks/useXxxList.ts
   └─ 实现: CRUD方法 + useState管理

3. 创建XxxTable.tsx
   └─ 纯展示: 通过props接收数据和事件

4. 创建components/XxxFormModal.tsx
   └─ 表单: mode='create'|'edit'

5. 创建XxxPage.tsx
   └─ 编排: 组合Table + Modal + Hook
```

### 何时拆分组件？

```
文件行数 > 200？
├─ 是 → 立即拆分
│   ├─ 表格过大？→ 拆分columns到单独文件
│   ├─ Modal过大？→ 提取到components/
│   └─ Page过大？→ 提取业务逻辑到Hook
│
└─ 否 → 保持现状
```

---

## ⚠️ Constraints

### 文件大小限制
```
✅ 优秀: < 150行
⚠️ 可接受: 150-200行
❌ 需重构: > 200行 (立即拆分)
```

### 职责划分
```
❌ 错误: Table组件调用API
❌ 错误: 路由直接指向Feature组件
❌ 错误: 组件内定义Interface

✅ 正确: Page编排 → Features展示 → Services API
✅ 正确: 类型在types.ts定义
✅ 正确: 业务逻辑在Hook封装
```

### TypeScript严格模式
```
✅ 必须: strict: true
❌ 禁止: any类型
✅ 推荐: 使用Zod或io-ts做运行时校验
```

---

## 📝 Naming Conventions

### 文件命名
```
✅ 正确:
  - ProductsPage.tsx (页面组件)
  - ProductTable.tsx (展示组件)
  - useProductList.ts (Hook)
  - ProductFormModal.tsx (Modal组件)

❌ 错误:
  - product.tsx (太简略)
  - ProductManagement.tsx (太冗长)
  - product-list.tsx (kebab-case)
```

### 组件导出
```typescript
// ✅ 推荐: 命名导出
export const ProductTable: React.FC<Props> = () => {};

// ✅ 也可: 默认导出（仅Page组件）
export default function ProductsPage() {}
```

---

## 🎯 Quick Reference

### API调用
```typescript
// ✅ 正确 - 在Hook中
const fetchItems = async () => {
    const data = await api.get('/products');
};

// ❌ 错误 - 在组件中
useEffect(() => {
    fetch('/api/products').then(...)  // 禁止！
}, []);
```

### 分页处理
```typescript
// ✅ Ant Design分页（1-indexed）
<Table
    pagination={{
        current: currentPage + 1,  // 后端0 → 前端1
        total,
        pageSize,
    }}
    onChange={(page) => {
        fetchItems({ page: page.current - 1 });  // 前端1 → 后端0
    }}
/>
```

### 表单验证
```typescript
// ✅ 使用Ant Design Form
<Form
    form={form}
    onFinish={handleSubmit}
>
    <Form.Item
        name="name"
        rules={[{ required: true, message: '请输入名称' }]}
    >
        <Input />
    </Form.Item>
</Form>
```

---

**保持文件简洁，职责清晰，类型安全！** ✨
