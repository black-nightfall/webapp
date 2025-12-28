// 订单接口定义
export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

// 订单创建表单数据
export interface OrderFormData {
    userId: number;
    productIds: number[];
    totalAmount: number;
}
