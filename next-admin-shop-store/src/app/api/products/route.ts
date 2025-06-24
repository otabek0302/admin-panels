import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/cloudinary';

import type { User } from '@/interfaces/user';
import type { Session } from 'next-auth';
import type { Product, ProductRequest } from '@/interfaces/product';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
    const session = (await getServerSession(authOptions as any)) as Session & { user: User };
    if (!session?.user) return null;
    return session;
}

// GET /api/products — Admin-only: returns paginated list of products with sales count
export async function GET(req: Request) {
    const session = await isAdminSession();

    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '15', 15);
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        const where = {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { brand: { contains: search, mode: 'insensitive' as const } },
                { category: { name: { contains: search, mode: 'insensitive' as const } } }
            ]
        };

        const [products, total] = await Promise.all([prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                category: true,
                orderItems: {
                    where: {
                        order: { status: 'COMPLETED' },
                    },
                    select: { quantity: true },
                },
            },
        }), prisma.product.count({ where })]);

        const productsWithSales = products.map((product: Product) => ({
            ...product,
            sales: product.orderItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
        }));

        return NextResponse.json({
            products: productsWithSales,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('❌ Failed to fetch products:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/products — Admin-only: creates a new product after validation & image upload
export async function POST(req: Request) {
    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = (await req.json()) as ProductRequest;
        const { name, description, brand, price, stock, imageBase64, categoryId } = body;

        if (!name || !description || !brand || !price || !stock || !imageBase64 || !categoryId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const existingProduct = await prisma.product.findFirst({ where: { name } });

        if (existingProduct) {
            return NextResponse.json({ message: 'Product already exists' }, { status: 400 });
        }

        const uploadedImage = await uploadImage(imageBase64);

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                brand,
                price,
                stock,
                category: { connect: { id: categoryId } },
                image: {
                    url: uploadedImage.url,
                    publicId: uploadedImage.publicId,
                },
            },
            include: {
                category: true,
                orderItems: {
                    where: {
                        order: { status: 'COMPLETED' },
                    },
                    select: { quantity: true },
                },
            },
        });

        const productWithSales = {
            ...newProduct,
            sales: newProduct.orderItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
        };

        return NextResponse.json(productWithSales);
    } catch (error) {
        console.error('❌ Failed to create product:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}