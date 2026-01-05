// 角色相关类型定义
export interface Role {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
}

export interface UpdateRoleRequest {
    name?: string;
    description?: string;
}

export interface SearchRoleParams {
    name?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

// 菜单相关类型定义
export interface Menu {
    id: number;
    parentId: number;
    title: string;
    name?: string;
    path?: string;
    component?: string;
    perms?: string;
    icon?: string;
    sortOrder?: number;
    menuType: 'M' | 'C' | 'F'; // M:目录, C:菜单, F:按钮
    createdAt?: string;
    updatedAt?: string;
    children?: Menu[];
}

export interface AssignPermissionsRequest {
    menuIds: number[];
}

// 分页响应
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    empty?: boolean;
}
