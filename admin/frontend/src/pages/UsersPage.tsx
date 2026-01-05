import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import { roleApi } from '../services/roleApi';
import type { Role } from '../features/role/types';
import type { User } from '../features/user/types';
import { UserTable } from '../features/user/UserTable';
import { UserSearchForm } from '../features/user/components/UserSearchForm';
import { UserFormModal } from '../features/user/components/UserFormModal';
import { useUserList } from '../features/user/hooks/useUserList';

const UsersPage: React.FC = () => {
    // 使用自定义hook获取用户列表逻辑
    const {
        users,
        loading,
        total,
        currentPage,
        pageSize,
        createUser,
        updateUser,
        deleteUser,
        search,
        resetSearch,
        fetchUsers,
        updateSort,
    } = useUserList();

    // 角色列表
    const [roles, setRoles] = useState<Role[]>([]);

    // Modal 状态
    const [formModal, setFormModal] = useState<{
        visible: boolean;
        mode: 'create' | 'edit';
        user: User | null;
    }>({
        visible: false,
        mode: 'create',
        user: null,
    });

    // 加载角色列表
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const roleList = await roleApi.getRoles();
                setRoles(roleList);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, []);

    // 打开创建Modal
    const handleCreate = () => {
        setFormModal({ visible: true, mode: 'create', user: null });
    };

    // 打开编辑Modal
    const handleEdit = (user: User) => {
        setFormModal({ visible: true, mode: 'edit', user });
    };

    // 提交表单（创建或编辑）
    const handleFormSubmit = async (values: any) => {
        try {
            if (formModal.mode === 'create') {
                await createUser(values);
            } else if (formModal.user) {
                await updateUser(formModal.user.id, values);
            }
            setFormModal({ visible: false, mode: 'create', user: null });
        } catch (error) {
            // 错误已在hook中处理
            throw error;
        }
    };

    // 关闭Modal
    const handleModalCancel = () => {
        setFormModal({ visible: false, mode: 'create', user: null });
    };

    // 删除用户
    const handleDelete = (user: User) => {
        Modal.confirm({
            title: 'Delete User',
            content: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteUser(user.id);
                } catch (err) {
                    message.error('Failed to delete user');
                    console.error('Error deleting user:', err);
                }
            },
        });
    };

    // 处理分页和排序变化
    const handleTableChange = (pagination: TablePaginationConfig, _filters: any, sorter: any) => {
        const page = (pagination.current || 1) - 1; // Ant Design pagination is 1-indexed
        const size = pagination.pageSize || pageSize;

        let sort = 'createdAt';
        let direction: 'asc' | 'desc' = 'desc';

        if (sorter.field && sorter.order) {
            sort = sorter.field as string;
            direction = sorter.order === 'ascend' ? 'asc' : 'desc';
            updateSort(sort, direction);
        }

        fetchUsers({ page, size, sortBy: sort, sortDirection: direction });
    };

    return (
        <div>
            <h2>User Management</h2>

            {/* 搜索表单 */}
            <UserSearchForm onSearch={search} onReset={resetSearch} />

            {/* 操作按钮 */}
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
                    Create User
                </Button>
            </div>

            {/* 用户列表表格 */}
            <UserTable
                users={users}
                roles={roles}
                loading={loading}
                pagination={{
                    current: currentPage + 1,
                    pageSize: pageSize,
                    total: total,
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChange={handleTableChange}
            />

            {/* 用户表单Modal（创建和编辑） */}
            <UserFormModal
                visible={formModal.visible}
                mode={formModal.mode}
                initialValues={formModal.user || undefined}
                roles={roles}
                onSubmit={handleFormSubmit}
                onCancel={handleModalCancel}
            />
        </div>
    );
};

export default UsersPage;
