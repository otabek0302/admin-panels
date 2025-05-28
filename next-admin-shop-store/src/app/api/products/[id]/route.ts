import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

import type { Session, User } from 'next-auth';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
    const session = (await getServerSession(authOptions as any)) as Session & { user: User };
    if (!session?.user || session.user.role !== 'ADMIN') return null;
    return session;
}

// GET /api/products/:id — get product by ID
export async function GET(_: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                brand: true,
                price: true,
                stock: true,
                image: true,
                category: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('❌ Error fetching product:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/products/:id — update product
export async function PUT(req: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const body = await req.json();
        const { name, description, brand, price, stock, categoryId, imageBase64 } = body;

        if (!name || !description || !brand || !price || !stock || !categoryId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        let imageData = existing.image;
        if (imageBase64) {
            if (existing.image?.publicId) {
                await deleteImage(existing.image.publicId);
            }
            imageData = await uploadImage(imageBase64);
        }

        const updated = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                brand,
                price,
                stock,
                category: { connect: { id: categoryId } },
                image: imageData && imageData.url && imageData.publicId ? {
                    url: imageData.url,
                    publicId: imageData.publicId,
                } : existing.image,
            },
            select: {
                id: true,
                name: true,
                description: true,
                brand: true,
                price: true,
                stock: true,
                image: true,
                category: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('❌ Error updating product:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/products/:id — delete product
export async function DELETE(_: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const existing = await prisma.product.findUnique({
            where: { id },
            include: {
                orderItems: {
                    where: { order: { status: { not: 'CANCELLED' } } },
                },
            },
        });

        if (!existing) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        if (existing.orderItems.length > 0) {
            return NextResponse.json({
                message: 'Cannot delete product because it has active orders. Please cancel or complete them first.',
            }, { status: 400 });
        }

        if (existing.image?.publicId) {
            await deleteImage(existing.image.publicId);
        }

        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('❌ Error deleting product:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}