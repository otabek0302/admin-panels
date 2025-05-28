import { Category } from './category';

interface Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    image: {
        url: string;
        publicId: string;
    };
    imageBase64?: string;
    sales?: number;
    category: Category;
    orderItems: Array<{
        id: string;
        quantity: number;
        price: number;
        total: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

interface ProductRequest {
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    imageBase64: string;
    categoryId: string;
}

interface ProductResponse {
    products: Product[];
    total: number;
}

export type { Product, ProductRequest, ProductResponse };