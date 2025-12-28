import { useState, useEffect } from 'react';
import { message } from 'antd';
import { roleApi } from '../../../services/roleApi';
import type { Role, SearchRoleParams } from '../types';

export const useRoleList = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchName, setSearchName] = useState('');

    // 获取角色列表
    const fetchRoles = async (params?: {
        page?: number;
        size?: number;
        name?: string;
    }) => {
        setLoading(true);
        try {
            const pageNum = params?.page ?? currentPage;
            const pageSz = params?.size ?? pageSize;
            const name = params?.name ?? searchName;

            const queryParams: SearchRoleParams = {
                page: pageNum,
                size: pageSz,
                sortBy: 'createdAt',
                sortDirection: 'desc',
            };

            if (name) {
                queryParams.name = name;
            }

            const data = await roleApi.searchRoles(queryParams);
            setRoles(data.content);
            setTotal(data.totalElements);
            setCurrentPage(pageNum);
            setPageSize(pageSz);
        } catch (error) {
            message.error('加载角色列表失败');
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    // 创建角色
    const createRole = async (data: any) => {
        await roleApi.createRole(data);
        message.success('角色创建成功');
        await fetchRoles();
    };

    // 更新角色
    const updateRole = async (id: number, data: any) => {
        await roleApi.updateRole(id, data);
        message.success('角色更新成功');
        await fetchRoles();
    };

    // 删除角色
    const deleteRole = async (id: number) => {
        await roleApi.deleteRole(id);
        message.success('角色删除成功');
        await fetchRoles();
    };

    // 搜索
    const search = (name: string) => {
        setSearchName(name);
        fetchRoles({ page: 0, name });
    };

    // 重置搜索
    const resetSearch = () => {
        setSearchName('');
        fetchRoles({ page: 0, name: '' });
    };

    // 初始加载
    useEffect(() => {
        fetchRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        // 状态
        roles,
        loading,
        total,
        currentPage,
        pageSize,
        searchName,
        // 方法
        fetchRoles,
        createRole,
        updateRole,
        deleteRole,
        search,
        resetSearch,
        setSearchName,
    };
};
