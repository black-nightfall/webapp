import React, { useEffect, useState } from 'react';
import { Table, Alert, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import api from '../../services/api';

interface Product {
    id: number;
    name: string;
    price: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get<Product[]>('/products');
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load products. Please try again.');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Product> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price.toFixed(2)}`,
        },
    ];

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                action={
                    <Button size="small" danger onClick={fetchProducts}>
                        Retry
                    </Button>
                }
                style={{ marginBottom: 16 }}
            />
        );
    }

    return (
        <div>
            <h2>Product List</h2>
            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ProductList;
