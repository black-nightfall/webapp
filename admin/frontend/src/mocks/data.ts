// Mock数据类型定义
export interface MockUser {
    id: number;
    uid: string;
    username: string;
    email: string;
    fullName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MockProduct {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MockOrder {
    id: number;
    orderNumber: string;
    userId: number;
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

// Mock用户数据
export const mockUsers: MockUser[] = [
    {
        id: 1,
        uid: '123e4567-e89b-12d3-a456-426614174000',
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Administrator',
        isActive: true,
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00',
    },
    {
        id: 2,
        uid: '223e4567-e89b-12d3-a456-426614174001',
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        isActive: true,
        createdAt: '2025-01-02T00:00:00',
        updatedAt: '2025-01-02T00:00:00',
    },
    {
        id: 3,
        uid: '323e4567-e89b-12d3-a456-426614174002',
        username: 'jane_smith',
        email: 'jane@company.com',
        fullName: 'Jane Smith',
        isActive: false,
        createdAt: '2025-01-03T00:00:00',
        updatedAt: '2025-01-03T00:00:00',
    },
];

// Mock商品数据
export const mockProducts: MockProduct[] = [
    {
        id: 1,
        name: 'Laptop Pro 2024',
        price: 1299.99,
        stockQuantity: 50,
        description: 'High-performance laptop with 16GB RAM',
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00',
    },
    {
        id: 2,
        name: 'Wireless Mouse',
        price: 29.99,
        stockQuantity: 200,
        description: 'Ergonomic wireless mouse',
        createdAt: '2025-01-02T00:00:00',
        updatedAt: '2025-01-02T00:00:00',
    },
    {
        id: 3,
        name: 'Mechanical Keyboard',
        price: 89.99,
        stockQuantity: 75,
        description: 'RGB mechanical keyboard',
        createdAt: '2025-01-03T00:00:00',
        updatedAt: '2025-01-03T00:00:00',
    },
];

// Mock订单数据
export const mockOrders: MockOrder[] = [
    {
        id: 1,
        orderNumber: 'ORD20250101001',
        userId: 2,
        totalAmount: 1329.98,
        status: 'DELIVERED',
        createdAt: '2025-01-05T10:00:00',
        updatedAt: '2025-01-10T15:30:00',
    },
    {
        id: 2,
        orderNumber: 'ORD20250102001',
        userId: 3,
        totalAmount: 119.98,
        status: 'SHIPPED',
        createdAt: '2025-01-08T14:20:00',
        updatedAt: '2025-01-09T09:15:00',
    },
    {
        id: 3,
        orderNumber: 'ORD20250103001',
        userId: 2,
        totalAmount: 29.99,
        status: 'PENDING',
        createdAt: '2025-01-12T16:45:00',
        updatedAt: '2025-01-12T16:45:00',
    },
];
