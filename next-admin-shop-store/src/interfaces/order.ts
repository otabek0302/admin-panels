import { OrderStatus } from '@prisma/client';
import { Product } from './product';

interface Order {
    id: string;
    orderItems: OrderItem[];
    total: number;
    discount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
    total: number;
    discount: number;
    name: string;
    image: {
        publicId: string;
        url: string;
    };
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderRequest {
    orderItems: OrderItem[];
    total: number;
    discount: number;
    status?: OrderStatus;
}

interface OrderResponse {
    orders: Order[];
    total: number;
}

export type { Order, OrderItem, OrderRequest, OrderResponse }; 