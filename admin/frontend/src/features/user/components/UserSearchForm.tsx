import React from 'react';
import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { SearchParams } from '../types';

interface UserSearchFormProps {
    onSearch: (values: SearchParams) => void;
    onReset: () => void;
}

export const UserSearchForm: React.FC<UserSearchFormProps> = ({ onSearch, onReset }) => {
    const [form] = Form.useForm<SearchParams>();

    const handleSubmit = async () => {
        const values = await form.validateFields();
        onSearch(values);
    };

    const handleReset = () => {
        form.resetFields();
        onReset();
    };

    return (
        <Form
            form={form}
            layout="inline"
            onFinish={handleSubmit}
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
                        <Button onClick={handleReset} icon={<ReloadOutlined />}>
                            Reset
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    );
};
