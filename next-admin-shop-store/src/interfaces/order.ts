import { Category } from './category';
import { Product } from './product';

interface Order {
    id: string;
    orderItems: OrderItem[];
    brand: string;
    price: number;
    stock: number;
    image: string;
    category: Category;
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
}

interface OrderRequest {
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    image: string;
    categoryId: string;
}

interface OrderResponse {
    orders: Order[];
    total: number;
}

export type { Order, OrderItem, OrderRequest, OrderResponse };