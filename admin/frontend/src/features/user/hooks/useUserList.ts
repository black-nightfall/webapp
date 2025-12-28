import { useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../../../services/api';
import type { User, UserFormData, SearchParams, PageResponse } from '../types';

export const useUserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchParams, setSearchParams] = useState<SearchParams>({});

    // 获取用户列表
    const fetchUsers = async (params?: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
        search?: SearchParams;
    }) => {
        setLoading(true);
        try {
            const pageNum = params?.page ?? currentPage;
            const pageSz = params?.size ?? pageSize;
            const sort = params?.sortBy ?? sortBy;
            const direction = params?.sortDirection ?? sortDirection;
            const search = params?.search ?? searchParams;

            const queryParams: any = {
                page: pageNum,
                size: pageSz,
                sortBy: sort,
                sortDirection: direction,
                ...search,
            };

            // 处理 isActive 参数
            if (queryParams.isActive === '') {
                delete queryParams.isActive;
            } else if (queryParams.isActive === 'true') {
                queryParams.isActive = true;
            } else if (queryParams.isActive === 'false') {
                queryParams.isActive = false;
            }

            const response = await api.get<{ data: PageResponse<User> }>('/users/search', { params: queryParams });
            const data = response.data;

            setUsers(data.content);
            setTotal(data.totalElements);
            setCurrentPage(pageNum);
            setPageSize(pageSz);
        } catch (err) {
            message.error('Failed to load users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    // 创建用户
    const createUser = async (data: UserFormData) => {
        await api.post('/users', data);
        message.success('User created successfully');
        await fetchUsers(); // 重新加载列表
    };

    // 更新用户
    const updateUser = async (id: number, data: UserFormData) => {
        await api.put(`/users/${id}`, data);
        message.success('User updated successfully');
        await fetchUsers(); // 重新加载列表
    };

    // 删除用户
    const deleteUser = async (id: number) => {
        await api.delete(`/users/${id}`);
        message.success('User deleted successfully');
        await fetchUsers(); // 重新加载列表
    };

    // 搜索
    const search = (params: SearchParams) => {
        setSearchParams(params);
        fetchUsers({ page: 0, search: params }); // 搜索时重置到第一页
    };

    // 重置搜索
    const resetSearch = () => {
        setSearchParams({});
        fetchUsers({ page: 0, search: {} });
    };

    // 更新排序
    const updateSort = (field: string, direction: 'asc' | 'desc') => {
        setSortBy(field);
        setSortDirection(direction);
    };

    // 初始加载
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        // 状态
        users,
        loading,
        total,
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        searchParams,
        // 方法
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        search,
        resetSearch,
        updateSort,
    };
};
