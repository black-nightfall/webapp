// 产品接口定义
export interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity?: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}
