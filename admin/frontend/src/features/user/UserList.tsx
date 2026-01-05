import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    message,
    Tag,
    Row,
    Col,
    Select
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { roleApi } from '../../services/roleApi';
import type { Role } from '../role/types';
import type { User, SearchParams } from './types';
import { UserFormModal } from './components/UserFormModal';
import { useUserList } from './hooks/useUserList';

const UserList: React.FC = () => {
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

    // 搜索表单
    const [searchForm] = Form.useForm<SearchParams>();

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

    // 搜索
    const handleSearch = async () => {
        const values = await searchForm.validateFields();
        search(values);
    };

    // 重置搜索
    const handleResetSearch = () => {
        searchForm.resetFields();
        resetSearch();
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

    // 表格列定义
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
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>User Management</h2>

            {/* 搜索表单 */}
            <Form
                form={searchForm}
                layout="inline"
                onFinish={handleSearch}
                style={{ marginBottom: 16 }}
            >
                <Row gutter={16} style={{ width: '100%' }}>
                    <Col span={6}>
                        <Form.Item name="username" style={{ marginBottom: 0, width: '100%' }}>
                            <Input placeholder="Search by username" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="email" style={{ marginBottom: 0, width: '100%' }}>
                            <Input placeholder="Search by email" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="isActive" style={{ marginBottom: 0, width: '100%' }}>
                            <Select placeholder="Select status" allowClear>
                                <Select.Option value="">All</Select.Option>
                                <Select.Option value="true">Active</Select.Option>
                                <Select.Option value="false">Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                Search
                            </Button>
                            <Button onClick={handleResetSearch} icon={<ReloadOutlined />}>
                                Reset
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>

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
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                onChange={handleTableChange}
                pagination={{
                    current: currentPage + 1, // Ant Design pagination is 1-indexed
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} users`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
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

export default UserList;
