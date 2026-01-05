import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Role } from './types';

interface RoleTableProps {
    roles: Role[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onAssignPermissions: (role: Role) => void;
    onChange: (pagination: TablePaginationConfig) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
    roles,
    loading,
    pagination,
    onEdit,
    onDelete,
    onAssignPermissions,
    onChange,
}) => {
    const columns: ColumnsType<Role> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || '-',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: '操作',
            key: 'actions',
            width: 280,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        icon={<SafetyCertificateOutlined />}
                        onClick={() => onAssignPermissions(record)}
                    >
                        分配权限
                    </Button>
                    <Popconfirm
                        title="删除角色"
                        description={`确定要删除角色 "${record.name}" 吗？此操作不可撤销。`}
                        onConfirm={() => onDelete(record)}
                        okText="删除"
                        cancelText="取消"
                        okType="danger"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            onChange={onChange}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 个角色`,
                pageSizeOptions: ['10', '20', '50', '100'],
            }}
        />
    );
};
