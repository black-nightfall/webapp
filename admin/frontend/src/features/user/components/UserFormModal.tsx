import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Select, message } from 'antd';
import type { User, UserFormData } from '../types';
import type { Role } from '../../role/types';

interface UserFormModalProps {
    visible: boolean;
    mode: 'create' | 'edit';
    initialValues?: User;
    roles: Role[];
    onSubmit: (values: UserFormData) => Promise<void>;
    onCancel: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
    visible,
    mode,
    initialValues,
    roles,
    onSubmit,
    onCancel,
}) => {
    const [form] = Form.useForm<UserFormData>();
    const [submitting, setSubmitting] = useState(false);

    // 当Modal显示时，设置表单值
    useEffect(() => {
        if (visible) {
            if (mode === 'edit' && initialValues) {
                form.setFieldsValue({
                    username: initialValues.username,
                    email: initialValues.email,
                    fullName: initialValues.fullName,
                    isActive: initialValues.isActive,
                    roleId: initialValues.roleId,
                    password: undefined, // 编辑时不显示密码
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ isActive: true }); // 默认激活
            }
        }
    }, [visible, mode, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // 如果是编辑模式且密码为空，删除密码字段
            if (mode === 'edit' && !values.password) {
                delete values.password;
            }

            await onSubmit(values);
            form.resetFields();
        } catch (err: any) {
            if (err.errorFields) {
                // 表单验证错误，不做处理
                return;
            }
            message.error(`Failed to ${mode} user`);
            console.error(`Error ${mode} user:`, err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={mode === 'create' ? 'Create User' : 'Edit User'}
            open={visible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            confirmLoading={submitting}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
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
                    extra={mode === 'edit' ? 'Leave blank to keep current password' : undefined}
                    rules={[
                        { required: mode === 'create', message: 'Please input password!' },
                        { min: 8, message: 'Password must be at least 8 characters' },
                    ]}
                >
                    <Input.Password placeholder={mode === 'edit' ? 'Enter new password (optional)' : 'Enter password'} />
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
    );
};
