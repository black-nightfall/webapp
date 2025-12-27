import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from 'axios';
import { mockApi } from '../mocks/api';

// Create a custom API client interface that returns unwrapped data
interface ApiClient extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> {
    get<T = unknown>(url: string, config?: Parameters<AxiosInstance['get']>[1]): Promise<T>;
    post<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['post']>[2]): Promise<T>;
    put<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['put']>[2]): Promise<T>;
    delete<T = unknown>(url: string, config?: Parameters<AxiosInstance['delete']>[1]): Promise<T>;
    patch<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['patch']>[2]): Promise<T>;
}

// 环境配置
const API_MODE = import.meta.env.VITE_API_MODE || 'real';
const isMockMode = API_MODE === 'mock';

console.log('🔧 API Mode:', API_MODE);
console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL);

// ==================== Mock API Handler ====================
const mockApiHandler = {
    async get<T>(url: string, config?: any): Promise<T> {
        console.log('📦 Mock GET:', url, config?.params);

        // Auth
        if (url.includes('/auth/logout')) {
            return mockApi.auth.logout() as Promise<T>;
        }

        // Users
        if (url.match(/\/users\/\d+$/)) {
            const id = parseInt(url.split('/').pop() || '0');
            return mockApi.user.getUserById(id) as Promise<T>;
        }
        if (url.includes('/users/search')) {
            // 从 config.params 获取查询参数
            const params = config?.params || {};
            return mockApi.user.searchUsers(params) as Promise<T>;
        }
        if (url === '/users') {
            return mockApi.user.getUsers() as Promise<T>;
        }

        // Products
        if (url.match(/\/products\/\d+$/)) {
            const id = parseInt(url.split('/').pop() || '0');
            return mockApi.product.getProductById(id) as Promise<T>;
        }
        if (url === '/products') {
            return mockApi.product.getProducts() as Promise<T>;
        }

        // Orders
        if (url.match(/\/orders\/\d+$/)) {
            const id = parseInt(url.split('/').pop() || '0');
            return mockApi.order.getOrderById(id) as Promise<T>;
        }
        if (url === '/orders') {
            return mockApi.order.getOrders() as Promise<T>;
        }

        throw new Error(`Mock API not implemented for GET ${url}`);
    },

    async post<T>(url: string, data?: unknown): Promise<T> {
        console.log('📦 Mock POST:', url, data);

        // Auth
        if (url.includes('/auth/login')) {
            const { username, password } = data as { username: string; password: string };
            return mockApi.auth.login(username, password) as Promise<T>;
        }

        // Users
        if (url === '/users') {
            return mockApi.user.createUser(data as any) as Promise<T>;
        }

        // Products
        if (url === '/products') {
            return mockApi.product.createProduct(data as any) as Promise<T>;
        }

        // Orders
        if (url === '/orders') {
            return mockApi.order.createOrder(data as any) as Promise<T>;
        }

        throw new Error(`Mock API not implemented for POST ${url}`);
    },

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
    },

    async delete<T>(url: string): Promise<T> {
        console.log('📦 Mock DELETE:', url);

        // Users
        if (url.match(/\/users\/\d+$/)) {
            const id = parseInt(url.split('/').pop() || '0');
            return mockApi.user.deleteUser(id) as Promise<T>;
        }

        // Products
        if (url.match(/\/products\/\d+$/)) {
            const id = parseInt(url.split('/').pop() || '0');
            return mockApi.product.deleteProduct(id) as Promise<T>;
        }

        throw new Error(`Mock API not implemented for DELETE ${url}`);
    },

    async patch<T>(url: string, data?: unknown): Promise<T> {
        console.log('📦 Mock PATCH:', url, data);
        throw new Error(`Mock API not implemented for PATCH ${url}`);
    },
};

// ==================== Real API Instance ====================
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach auth token and language
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add auth token
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error('Failed to parse user data:', error);
            }
        }

        // Add language header
        const language = localStorage.getItem('language') || 'zh-CN';
        config.headers['Accept-Language'] = language;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

// ==================== API Client (支持Mock切换) ====================
const createApiClient = (): ApiClient => {
    if (isMockMode) {
        console.log('✅ Using Mock API');
        return mockApiHandler as unknown as ApiClient;
    } else {
        console.log('✅ Using Real API');
        return axiosInstance as ApiClient;
    }
};

const api = createApiClient();

export default api;
