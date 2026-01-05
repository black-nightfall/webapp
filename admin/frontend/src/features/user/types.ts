// 用户接口定义
export interface User {
    id: number;
    uid: string;
    username: string;
    email: string;
    fullName: string;
    isActive: boolean;
    roleId?: number;
    createdAt: string;
    updatedAt: string;
}

// 表单数据接口
export interface UserFormData {
    username: string;
    email: string;
    password?: string;
    fullName: string;
    isActive: boolean;
    roleId?: number;
}

// 搜索参数接口
export interface SearchParams {
    username?: string;
    email?: string;
    isActive?: boolean | string;
}

// 分页响应接口
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
