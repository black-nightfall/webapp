import api from './api';
import type { Role, CreateRoleRequest, UpdateRoleRequest, SearchRoleParams, Menu, AssignPermissionsRequest, PageResponse } from '../features/role/types';

// API响应包装类型
interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

// 角色API服务
export const roleApi = {
    // 获取所有角色
    async getRoles(): Promise<Role[]> {
        const response = await api.get<ApiResponse<Role[]>>('/roles');
        return response.data;
    },

    // 根据ID获取角色
    async getRoleById(id: number): Promise<Role> {
        const response = await api.get<ApiResponse<Role>>(`/roles/${id}`);
        return response.data;
    },

    // 搜索角色（分页）
    async searchRoles(params: SearchRoleParams): Promise<PageResponse<Role>> {
        const response = await api.get<ApiResponse<PageResponse<Role>>>('/roles/search', { params });
        return response.data;
    },

    // 创建角色
    async createRole(data: CreateRoleRequest): Promise<Role> {
        const response = await api.post<ApiResponse<Role>>('/roles', data);
        return response.data;
    },

    // 更新角色
    async updateRole(id: number, data: UpdateRoleRequest): Promise<Role> {
        const response = await api.put<ApiResponse<Role>>(`/roles/${id}`, data);
        return response.data;
    },

    // 删除角色
    async deleteRole(id: number): Promise<void> {
        await api.delete<ApiResponse<void>>(`/roles/${id}`);
    },

    // 分配角色权限
    async assignPermissions(roleId: number, data: AssignPermissionsRequest): Promise<void> {
        await api.put<ApiResponse<void>>(`/roles/${roleId}/permissions`, data);
    },

    // 获取角色权限列表
    async getRolePermissions(roleId: number): Promise<Menu[]> {
        const response = await api.get<ApiResponse<Menu[]>>(`/roles/${roleId}/permissions`);
        return response.data;
    },
};

// 菜单API服务
export const menuApi = {
    // 获取所有菜单（平铺）
    async getMenus(): Promise<Menu[]> {
        const response = await api.get<ApiResponse<Menu[]>>('/menus');
        return response.data;
    },

    // 获取菜单树
    async getMenuTree(): Promise<Menu[]> {
        const response = await api.get<ApiResponse<Menu[]>>('/menus/tree');
        return response.data;
    },
};
