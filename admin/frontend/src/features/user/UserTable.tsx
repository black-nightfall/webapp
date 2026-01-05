import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { User } from '../types';
import type { Role } from '../../role/types';

interface UserTableProps {
    users: User[];
    roles: Role[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onChange: (pagination: TablePaginationConfig, filters: any, sorter: any) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    roles,
    loading,
    pagination,
    onEdit,
    onDelete,
    onChange,
}) => {
    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'roleId',
            key: 'roleId',
            width: 150,
            render: (roleId?: number) => {
                if (!roleId) return <Tag>No Role</Tag>;
                const role = roles.find(r => r.id === roleId);
                return role ? <Tag color="blue">{role.name}</Tag> : <Tag>Unknown</Tag>;
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            sorter: true,
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            onChange={onChange}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} users`,
                pageSizeOptions: ['10', '20', '50', '100'],
            }}
        />
    );
};
