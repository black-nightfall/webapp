import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    Switch,
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
import api from '../../services/api';
import { roleApi } from '../../services/roleApi';
import type { Role } from '../role/types';

// 用户接口定义
interface User {
    id: number;
    uid: string;
    username: string;
    email: string;
    fullName: string;
    isActive: boolean;
    roleId?: number;
    createdAt: string;
    updatedAt: string;
}

// 表单数据接口
interface UserFormData {
    username: string;
    email: string;
    password?: string;
    fullName: string;
    isActive: boolean;
    roleId?: number;
}

// 搜索参数接口
interface SearchParams {
    username?: string;
    email?: string;
    isActive?: boolean | string;
}

// 分页响应接口
interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    empty?: boolean;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // 角色列表
    const [roles, setRoles] = useState<Role[]>([]);

    // Modal 状态
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 搜索状态
    const [searchParams, setSearchParams] = useState<SearchParams>({});

    // Form 实例
    const [createForm] = Form.useForm<UserFormData>();
    const [editForm] = Form.useForm<UserFormData>();
    const [searchForm] = Form.useForm<SearchParams>();

    // 加载角色列表
    const fetchRoles = async () => {
        try {
            const roleList = await roleApi.getRoles();
            setRoles(roleList);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    // 加载用户列表
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

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // 处理分页变化
    const handleTableChange = (pagination: TablePaginationConfig, _filters: any, sorter: any) => {
        const page = (pagination.current || 1) - 1; // Ant Design pagination is 1-indexed
        const size = pagination.pageSize || pageSize;

        let sort = sortBy;
        let direction: 'asc' | 'desc' = sortDirection;

        if (sorter.field && sorter.order) {
            sort = sorter.field as string;
            direction = sorter.order === 'ascend' ? 'asc' : 'desc';
            setSortBy(sort);
            setSortDirection(direction);
        }

        fetchUsers({ page, size, sortBy: sort, sortDirection: direction });
    };

    // 打开创建用户 Modal
    const handleCreate = () => {
        createForm.resetFields();
        createForm.setFieldsValue({ isActive: true }); // 默认激活
        setCreateModalVisible(true);
    };

    // 创建用户
    const handleCreateSubmit = async () => {
        try {
            const values = await createForm.validateFields();
            setSubmitting(true);

            await api.post('/users', values);
            message.success('User created successfully');
            setCreateModalVisible(false);
            createForm.resetFields();
            fetchUsers(); // 重新加载列表
        } catch (err: any) {
            if (err.errorFields) {
                // 表单验证错误
                return;
            }
            message.error('Failed to create user');
            console.error('Error creating user:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // 打开编辑用户 Modal
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        editForm.setFieldsValue({
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            isActive: user.isActive,
            roleId: user.roleId,
            password: undefined, // 编辑时不显示密码
        });
        setEditModalVisible(true);
    };

    // 更新用户
    const handleEditSubmit = async () => {
        if (!selectedUser) return;

        try {
            const values = await editForm.validateFields();
            setSubmitting(true);

            // 如果密码为空，不发送密码字段
            const updateData: any = { ...values };
            if (!updateData.password) {
                delete updateData.password;
            }

            await api.put(`/users/${selectedUser.id}`, updateData);
            message.success('User updated successfully');
            setEditModalVisible(false);
            setSelectedUser(null);
            editForm.resetFields();
            fetchUsers(); // 重新加载列表
        } catch (err: any) {
            if (err.errorFields) {
                // 表单验证错误
                return;
            }
            message.error('Failed to update user');
            console.error('Error updating user:', err);
        } finally {
            setSubmitting(false);
        }
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
                    await api.delete(`/users/${user.id}`);
                    message.success('User deleted successfully');
                    fetchUsers(); // 重新加载列表
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
        setSearchParams(values);
        fetchUsers({ page: 0, search: values }); // 搜索时重置到第一页
    };

    // 重置搜索
    const handleResetSearch = () => {
        searchForm.resetFields();
        setSearchParams({});
        fetchUsers({ page: 0, search: {} });
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

            {/* 创建用户 Modal */}
            <Modal
                title="Create User"
                open={createModalVisible}
                onOk={handleCreateSubmit}
                onCancel={() => {
                    setCreateModalVisible(false);
                    createForm.resetFields();
                }}
                confirmLoading={submitting}
                width={600}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    initialValues={{ isActive: true }}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input username!' },
                            { min: 3, message: 'Username must be at least 3 characters' },
                        ]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input password!' },
                            { min: 8, message: 'Password must be at least 8 characters' },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="roleId"
                    >
                        <Select
                            placeholder="Select a role (optional)"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={roles.map(role => ({
                                label: role.name,
                                value: role.id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Active"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 编辑用户 Modal */}
            <Modal
                title="Edit User"
                open={editModalVisible}
                onOk={handleEditSubmit}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedUser(null);
                    editForm.resetFields();
                }}
                confirmLoading={submitting}
                width={600}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input username!' },
                            { min: 3, message: 'Username must be at least 3 characters' },
                        ]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        extra="Leave blank to keep current password"
                        rules={[
                            { min: 8, message: 'Password must be at least 8 characters' },
                        ]}
                    >
                        <Input.Password placeholder="Enter new password (optional)" />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="roleId"
                    >
                        <Select
                            placeholder="Select a role (optional)"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={roles.map(role => ({
                                label: role.name,
                                value: role.id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Active"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserList;
