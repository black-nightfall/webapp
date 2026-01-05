import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../types';

interface RoleFormModalProps {
    visible: boolean;
    role?: Role | null;
    onSubmit: (values: CreateRoleRequest | UpdateRoleRequest) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({
    visible,
    role,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [form] = Form.useForm();
    const isEdit = !!role;

    React.useEffect(() => {
        if (visible) {
            if (role) {
                form.setFieldsValue({
                    name: role.name,
                    description: role.description,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, role, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            // 表单验证失败
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={isEdit ? '编辑角色' : '创建角色'}
            open={visible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            confirmLoading={loading}
            width={500}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                preserve={false}
            >
                <Form.Item
                    label="角色名"
                    name="name"
                    rules={[
                        { required: true, message: '请输入角色名' },
                        { max: 100, message: '角色名长度不能超过100个字符' },
                    ]}
                >
                    <Input placeholder="请输入角色名" />
                </Form.Item>

                <Form.Item
                    label="描述"
                    name="description"
                    rules={[
                        { max: 500, message: '描述长度不能超过500个字符' },
                    ]}
                >
                    <Input.TextArea
                        placeholder="请输入角色描述（可选）"
                        rows={4}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoleFormModal;
