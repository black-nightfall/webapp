import api from './api';
import type { Menu } from '../features/role/types';

// ==================== Menu API ====================
export const menuApi = {
    // 获取所有菜单
    async getMenus(): Promise<Menu[]> {
        const response = await api.get<{ code: number; data: Menu[] }>('/menus');
        return response.data;
    },

    // 获取菜单树
    async getMenuTree(): Promise<Menu[]> {
        const response = await api.get<{ code: number; data: Menu[] }>('/menus/tree');
        return response.data;
    },
};
