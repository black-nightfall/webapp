import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from 'axios';

// Create a custom API client interface that returns unwrapped data
interface ApiClient extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> {
    get<T = unknown>(url: string, config?: Parameters<AxiosInstance['get']>[1]): Promise<T>;
    post<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['post']>[2]): Promise<T>;
    put<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['put']>[2]): Promise<T>;
    delete<T = unknown>(url: string, config?: Parameters<AxiosInstance['delete']>[1]): Promise<T>;
    patch<T = unknown>(url: string, data?: unknown, config?: Parameters<AxiosInstance['patch']>[2]): Promise<T>;
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach auth token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
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

// Cast to our custom type that reflects the interceptor unwrapping
const api = axiosInstance as ApiClient;

export default api;
