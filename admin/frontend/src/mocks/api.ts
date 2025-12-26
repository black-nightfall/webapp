import { mockUsers, mockProducts, mockOrders } from './data';
import type { MockUser, MockProduct, MockOrder } from './data';

// 延迟模拟网络请求
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 统一的响应格式
interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

const createSuccessResponse = <T,>(data: T, message: string = '操作成功'): ApiResponse<T> => ({
    success: true,
    code: 200,
    message,
    data,
});

// ==================== Auth API ====================
export const mockAuthApi = {
    async login(username: string, password: string) {
        await delay();

        // 简单的用户验证逻辑
        if (username === 'admin' && password === 'admin123') {
            return createSuccessResponse({
                token: 'mock-jwt-token-' + Date.now(),
                username: 'admin',
            }, '登录成功');
        }

        throw new Error('用户名或密码错误');
    },

    async logout() {
        await delay(300);
        return createSuccessResponse(null, '登出成功');
    },
};

// ==================== User API ====================
export const mockUserApi = {
    async getUsers() {
        await delay();
        return createSuccessResponse(mockUsers, '查询成功');
    },

    async getUserById(id: number) {
        await delay();
        const user = mockUsers.find(u => u.id === id);
        if (!user) {
            throw new Error('用户不存在');
        }
        return createSuccessResponse(user, '查询成功');
    },

    async createUser(userData: Partial<MockUser>) {
        await delay();
        const newUser: MockUser = {
            id: Math.max(...mockUsers.map(u => u.id), 0) + 1,
            uid: `${Date.now()}-mock-uid`,
            username: userData.username || 'new_user',
            email: userData.email || 'user@example.com',
            fullName: userData.fullName || 'New User',
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return createSuccessResponse(newUser, '创建成功');
    },

    async updateUser(id: number, userData: Partial<MockUser>) {
        await delay();
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
            throw new Error('用户不存在');
        }

        // 更新用户数据
        const existingUser = mockUsers[index];
        mockUsers[index] = {
            ...existingUser,
            ...userData,
            id: existingUser.id, // ID不可变
            uid: existingUser.uid, // UID不可变
            createdAt: existingUser.createdAt, // 创建时间不可变
            updatedAt: new Date().toISOString(),
        };

        return createSuccessResponse(mockUsers[index], '更新成功');
    },

    async deleteUser(id: number) {
        await delay();
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
            throw new Error('用户不存在');
        }

        mockUsers.splice(index, 1);
        return createSuccessResponse(null, '删除成功');
    },

    async searchUsers(params: {
        username?: string;
        email?: string;
        isActive?: boolean;
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    }) {
        await delay();

        let filtered = [...mockUsers];

        // 按条件过滤
        if (params.username) {
            filtered = filtered.filter(u => u.username.toLowerCase().includes(params.username!.toLowerCase()));
        }
        if (params.email) {
            filtered = filtered.filter(u => u.email.toLowerCase().includes(params.email!.toLowerCase()));
        }
        if (params.isActive !== undefined) {
            filtered = filtered.filter(u => u.isActive === params.isActive);
        }

        // 排序
        const sortBy = params.sortBy || 'createdAt';
        const sortDirection = params.sortDirection || 'desc';
        filtered.sort((a, b) => {
            const aValue = (a as any)[sortBy];
            const bValue = (b as any)[sortBy];

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // 分页
        const page = params.page || 0;
        const size = params.size || 10;
        const start = page * size;
        const end = start + size;
        const paginatedData = filtered.slice(start, end);

        return createSuccessResponse({
            content: paginatedData,
            totalElements: filtered.length,
            totalPages: Math.ceil(filtered.length / size),
            size,
            number: page,
            first: page === 0,
            last: end >= filtered.length,
            empty: paginatedData.length === 0,
        }, '查询成功');
    },
};


// ==================== Product API ====================
export const mockProductApi = {
    async getProducts() {
        await delay();
        return createSuccessResponse(mockProducts, '查询成功');
    },

    async getProductById(id: number) {
        await delay();
        const product = mockProducts.find(p => p.id === id);
        if (!product) {
            throw new Error('商品不存在');
        }
        return createSuccessResponse(product, '查询成功');
    },

    async createProduct(productData: Partial<MockProduct>) {
        await delay();
        const newProduct: MockProduct = {
            id: mockProducts.length + 1,
            name: productData.name || 'New Product',
            price: productData.price || 0,
            stockQuantity: productData.stockQuantity || 0,
            description: productData.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockProducts.push(newProduct);
        return createSuccessResponse(newProduct, '创建成功');
    },

    async updateProduct(id: number, productData: Partial<MockProduct>) {
        await delay();
        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('商品不存在');
        }

        const existingProduct = mockProducts[index];
        mockProducts[index] = {
            ...existingProduct,
            ...productData,
            id: existingProduct.id,
            createdAt: existingProduct.createdAt,
            updatedAt: new Date().toISOString(),
        };

        return createSuccessResponse(mockProducts[index], '更新成功');
    },

    async deleteProduct(id: number) {
        await delay();
        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('商品不存在');
        }

        mockProducts.splice(index, 1);
        return createSuccessResponse(null, '删除成功');
    },
};


// ==================== Order API ====================
export const mockOrderApi = {
    async getOrders() {
        await delay();
        return createSuccessResponse(mockOrders, '查询成功');
    },

    async getOrderById(id: number) {
        await delay();
        const order = mockOrders.find(o => o.id === id);
        if (!order) {
            throw new Error('订单不存在');
        }
        return createSuccessResponse(order, '查询成功');
    },

    async createOrder(orderData: Partial<MockOrder>) {
        await delay();
        const newOrder: MockOrder = {
            id: mockOrders.length + 1,
            orderNumber: `ORD${Date.now()}`,
            userId: orderData.userId || 1,
            totalAmount: orderData.totalAmount || 0,
            status: orderData.status || 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockOrders.push(newOrder);
        return createSuccessResponse(newOrder, '创建成功');
    },
};

// 导出所有Mock API
export const mockApi = {
    auth: mockAuthApi,
    user: mockUserApi,
    product: mockProductApi,
    order: mockOrderApi,
};
