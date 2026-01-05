import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    message,
    Input,
    Popconfirm,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { roleApi } from '../../services/roleApi';
import type { Role, SearchRoleParams } from './types';
import RoleFormModal from './components/RoleFormModal';
import RolePermissionModal from './components/RolePermissionModal';

const RoleList: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchName, setSearchName] = useState('');

    // Modal状态
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [permissionModalVisible, setPermissionModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 加载角色列表
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

    useEffect(() => {
        fetchRoles();
    }, []);

    // 处理分页变化
    const handleTableChange = (pagination: TablePaginationConfig) => {
        const page = (pagination.current || 1) - 1;
        const size = pagination.pageSize || pageSize;
        fetchRoles({ page, size });
    };

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
                await roleApi.updateRole(selectedRole.id, values);
                message.success('角色更新成功');
            } else {
                await roleApi.createRole(values);
                message.success('角色创建成功');
            }
            setFormModalVisible(false);
            setSelectedRole(null);
            fetchRoles();
        } catch (error) {
            message.error(selectedRole ? '角色更新失败' : '角色创建失败');
            console.error('Error submitting role:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // 删除角色
    const handleDelete = async (role: Role) => {
        try {
            await roleApi.deleteRole(role.id);
            message.success('角色删除成功');
            fetchRoles();
        } catch (error) {
            message.error('角色删除失败');
            console.error('Error deleting role:', error);
        }
    };

    // 打开权限分配Modal
    const handleAssignPermissions = (role: Role) => {
        setSelectedRole(role);
        setPermissionModalVisible(true);
    };

    // 搜索
    const handleSearch = () => {
        fetchRoles({ page: 0, name: searchName });
    };

    // 重置搜索
    const handleResetSearch = () => {
        setSearchName('');
        fetchRoles({ page: 0, name: '' });
    };

    // 表格列定义
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
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        icon={<SafetyCertificateOutlined />}
                        onClick={() => handleAssignPermissions(record)}
                    >
                        分配权限
                    </Button>
                    <Popconfirm
                        title="删除角色"
                        description={`确定要删除角色 "${record.name}" 吗？此操作不可撤销。`}
                        onConfirm={() => handleDelete(record)}
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
        <div>
            <h2>角色管理</h2>

            {/* 搜索栏 */}
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="按角色名搜索"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ width: 200 }}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                >
                    搜索
                </Button>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleResetSearch}
                >
                    重置
                </Button>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                    style={{ marginLeft: 'auto' }}
                >
                    新建角色
                </Button>
            </Space>

            {/* 角色列表表格 */}
            <Table
                columns={columns}
                dataSource={roles}
                rowKey="id"
                loading={loading}
                onChange={handleTableChange}
                pagination={{
                    current: currentPage + 1,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 个角色`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
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

export default RoleList;
