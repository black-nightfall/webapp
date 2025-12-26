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

// Mock用户数据（扩展到15+条记录）
export let mockUsers: MockUser[] = [
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
    {
        id: 4,
        uid: '423e4567-e89b-12d3-a456-426614174003',
        username: 'alice_wong',
        email: 'alice.wong@tech.com',
        fullName: 'Alice Wong',
        isActive: true,
        createdAt: '2025-01-04T00:00:00',
        updatedAt: '2025-01-04T00:00:00',
    },
    {
        id: 5,
        uid: '523e4567-e89b-12d3-a456-426614174004',
        username: 'bob_martin',
        email: 'bob.m@startup.io',
        fullName: 'Bob Martin',
        isActive: true,
        createdAt: '2025-01-05T00:00:00',
        updatedAt: '2025-01-05T00:00:00',
    },
    {
        id: 6,
        uid: '623e4567-e89b-12d3-a456-426614174005',
        username: 'charlie_brown',
        email: 'charlie@email.com',
        fullName: 'Charlie Brown',
        isActive: false,
        createdAt: '2025-01-06T00:00:00',
        updatedAt: '2025-01-06T00:00:00',
    },
    {
        id: 7,
        uid: '723e4567-e89b-12d3-a456-426614174006',
        username: 'diana_prince',
        email: 'diana@heroes.com',
        fullName: 'Diana Prince',
        isActive: true,
        createdAt: '2025-01-07T00:00:00',
        updatedAt: '2025-01-07T00:00:00',
    },
    {
        id: 8,
        uid: '823e4567-e89b-12d3-a456-426614174007',
        username: 'edward_norton',
        email: 'edward.n@theater.org',
        fullName: 'Edward Norton',
        isActive: true,
        createdAt: '2025-01-08T00:00:00',
        updatedAt: '2025-01-08T00:00:00',
    },
    {
        id: 9,
        uid: '923e4567-e89b-12d3-a456-426614174008',
        username: 'fiona_gallagher',
        email: 'fiona@southside.com',
        fullName: 'Fiona Gallagher',
        isActive: false,
        createdAt: '2025-01-09T00:00:00',
        updatedAt: '2025-01-09T00:00:00',
    },
    {
        id: 10,
        uid: 'a23e4567-e89b-12d3-a456-426614174009',
        username: 'george_miller',
        email: 'george@movies.net',
        fullName: 'George Miller',
        isActive: true,
        createdAt: '2025-01-10T00:00:00',
        updatedAt: '2025-01-10T00:00:00',
    },
    {
        id: 11,
        uid: 'b23e4567-e89b-12d3-a456-426614174010',
        username: 'helen_mirren',
        email: 'helen@royaltheatre.uk',
        fullName: 'Helen Mirren',
        isActive: true,
        createdAt: '2025-01-11T00:00:00',
        updatedAt: '2025-01-11T00:00:00',
    },
    {
        id: 12,
        uid: 'c23e4567-e89b-12d3-a456-426614174011',
        username: 'ian_mckellen',
        email: 'ian@wizards.com',
        fullName: 'Ian McKellen',
        isActive: false,
        createdAt: '2025-01-12T00:00:00',
        updatedAt: '2025-01-12T00:00:00',
    },
    {
        id: 13,
        uid: 'd23e4567-e89b-12d3-a456-426614174012',
        username: 'julia_roberts',
        email: 'julia@hollywood.com',
        fullName: 'Julia Roberts',
        isActive: true,
        createdAt: '2025-01-13T00:00:00',
        updatedAt: '2025-01-13T00:00:00',
    },
    {
        id: 14,
        uid: 'e23e4567-e89b-12d3-a456-426614174013',
        username: 'kevin_spacey',
        email: 'kevin@films.net',
        fullName: 'Kevin Spacey',
        isActive: true,
        createdAt: '2025-01-14T00:00:00',
        updatedAt: '2025-01-14T00:00:00',
    },
    {
        id: 15,
        uid: 'f23e4567-e89b-12d3-a456-426614174014',
        username: 'lisa_kudrow',
        email: 'lisa@friends.tv',
        fullName: 'Lisa Kudrow',
        isActive: false,
        createdAt: '2025-01-15T00:00:00',
        updatedAt: '2025-01-15T00:00:00',
    },
    {
        id: 16,
        uid: 'g23e4567-e89b-12d3-a456-426614174015',
        username: 'matt_damon',
        email: 'matt@action.com',
        fullName: 'Matt Damon',
        isActive: true,
        createdAt: '2025-01-16T00:00:00',
        updatedAt: '2025-01-16T00:00:00',
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
