import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { Role } from '../features/role/types';
import { RoleTable } from '../features/role/RoleTable';
import { RoleSearchForm } from '../features/role/components/RoleSearchForm';
import RoleFormModal from '../features/role/components/RoleFormModal';
import RolePermissionModal from '../features/role/components/RolePermissionModal';
import { useRoleList } from '../features/role/hooks/useRoleList';

const RolesPage: React.FC = () => {
    // 使用自定义hook获取角色列表逻辑
    const {
        roles,
        loading,
        total,
        currentPage,
        pageSize,
        searchName,
        createRole,
        updateRole,
        deleteRole,
        search,
        resetSearch,
        fetchRoles,
        setSearchName,
    } = useRoleList();

    // Modal 状态
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [permissionModalVisible, setPermissionModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 打开创建Modal
    const handleCreate = () => {
        setSelectedRole(null);
        setFormModalVisible(true);
    };

    // 打开编辑Modal
    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setFormModalVisible(true);
    };

    // 提交表单（创建或更新）
    const handleFormSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            if (selectedRole) {
                await updateRole(selectedRole.id, values);
            } else {
                await createRole(values);
            }
            setFormModalVisible(false);
            setSelectedRole(null);
        } catch (error) {
            // 错误已在hook中处理
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    // 删除角色
    const handleDelete = async (role: Role) => {
        try {
            await deleteRole(role.id);
        } catch (error) {
            // 错误已在hook中处理
        }
    };

    // 打开权限分配Modal
    const handleAssignPermissions = (role: Role) => {
        setSelectedRole(role);
        setPermissionModalVisible(true);
    };

    // 处理分页变化
    const handleTableChange = (pagination: TablePaginationConfig) => {
        const page = (pagination.current || 1) - 1;
        const size = pagination.pageSize || pageSize;
        fetchRoles({ page, size });
    };

    return (
        <div>
            <h2>角色管理</h2>

            {/* 搜索栏和创建按钮 */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <RoleSearchForm
                    value={searchName}
                    onChange={setSearchName}
                    onSearch={() => search(searchName)}
                    onReset={resetSearch}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
                    新建角色
                </Button>
            </div>

            {/* 角色列表表格 */}
            <RoleTable
                roles={roles}
                loading={loading}
                pagination={{
                    current: currentPage + 1,
                    pageSize: pageSize,
                    total: total,
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssignPermissions={handleAssignPermissions}
                onChange={handleTableChange}
            />

            {/* 创建/编辑角色Modal */}
            <RoleFormModal
                visible={formModalVisible}
                role={selectedRole}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                    setFormModalVisible(false);
                    setSelectedRole(null);
                }}
                loading={submitting}
            />

            {/* 权限分配Modal */}
            <RolePermissionModal
                visible={permissionModalVisible}
                roleId={selectedRole?.id || null}
                roleName={selectedRole?.name}
                onCancel={() => {
                    setPermissionModalVisible(false);
                    setSelectedRole(null);
                }}
                onSuccess={() => {
                    setPermissionModalVisible(false);
                    setSelectedRole(null);
                }}
            />
        </div>
    );
};

export default RolesPage;
