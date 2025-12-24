import React, { useState } from 'react';
import { Form, Button, message, InputNumber, Alert } from 'antd';
import api from '../../services/api';

const OrderCreate: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: { userId: number; productId: number }) => {
        setLoading(true);
        setError(null);
        try {
            await api.post(`/orders?userId=${values.userId}&productId=${values.productId}`);
            message.success('Order created successfully');
        } catch (err) {
            const errorMessage = 'Failed to create order. Please check the User ID and Product ID.';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error creating order:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <h2>Create Order</h2>

            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="User ID"
                    name="userId"
                    rules={[
                        { required: true, message: 'Please input user ID!' },
                        { type: 'number', min: 1, message: 'User ID must be positive' },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter user ID (e.g., 1)" />
                </Form.Item>

                <Form.Item
                    label="Product ID"
                    name="productId"
                    rules={[
                        { required: true, message: 'Please input product ID!' },
                        { type: 'number', min: 1, message: 'Product ID must be positive' },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter product ID (e.g., 100)" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Order
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default OrderCreate;
