import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { Session, User } from 'next-auth';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
    const session = (await getServerSession(authOptions as any)) as Session & { user: User };
    if (!session?.user) return null;
    return session;
}

// GET /api/orders/:id — get order by ID
export async function GET(_: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true  // Include product details
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('❌ Error fetching order:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/orders/:id — update order
export async function PUT(req: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const existing = await prisma.order.findUnique({
            where: { id },
            include: { orderItems: true },
        });
        if (!existing) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

        const body = await req.json();
        const { orderItems, total, discount, status } = body;

        if (!orderItems || !total || !discount || !status) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // If previous was COMPLETED and now not, restore stock
        if (existing.status === 'COMPLETED' && status !== 'COMPLETED') {
            for (const item of existing.orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
        }

        // If updated to COMPLETED, decrement stock
        if (status === 'COMPLETED') {
            for (const item of orderItems) {
                const product = await prisma.product.findUnique({ where: { id: item.productId } });
                if (!product) return NextResponse.json({ message: `Product ${item.productId} not found` }, { status: 404 });
                if (product.stock < item.quantity) {
                    return NextResponse.json({ message: `Insufficient stock for ${product.name}` }, { status: 400 });
                }
            }
            for (const item of orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
        }

        // Sanitize orderItems for Prisma
        const orderItemsForPrisma = orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
        }));

        // Delete all existing order items for this order
        await prisma.orderItem.deleteMany({ where: { orderId: id } });

        // Update the order and create new order items
        const updated = await prisma.order.update({
            where: { id },
            data: {
                orderItems: {
                    create: orderItemsForPrisma
                },
                total,
                discount,
                status
            },
            select: {
                id: true,
                orderItems: true,
                total: true,
                discount: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('❌ Error updating order:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/orders/:id — update order status
export async function PATCH(req: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const existing = await prisma.order.findUnique({ where: { id }, include: { orderItems: true } });
        if (!existing) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

        const body = await req.json();
        const { status } = body;

        if (!status) return NextResponse.json({ message: 'Missing status' }, { status: 400 });

        // Handle stock update
        if (existing.status === 'COMPLETED' && status !== 'COMPLETED') {
            for (const item of existing.orderItems) {
                await prisma.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
            }
        } else if (existing.status !== 'COMPLETED' && status === 'COMPLETED') {
            for (const item of existing.orderItems) {
                const product = await prisma.product.findUnique({ where: { id: item.productId } });
                if (!product || product.stock < item.quantity) {
                    return NextResponse.json({ message: `Insufficient stock for ${product?.name || 'Unknown product'}` }, { status: 400 });
                }
            }
            for (const item of existing.orderItems) {
                await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
            }
        }

        const updated = await prisma.order.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                orderItems: true,
                total: true,
                discount: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('❌ Error updating order status:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/orders/:id — delete order
export async function DELETE(_: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const existing = await prisma.order.findUnique({
            where: { id },
            include: { orderItems: true },
        });

        if (!existing) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

        // Restore stock if order was COMPLETED
        if (existing.status === 'COMPLETED') {
            for (const item of existing.orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
        }

        // Delete order items first
        await prisma.orderItem.deleteMany({
            where: { orderId: id }
        });

        // Then delete the order
        await prisma.order.delete({ where: { id } });
        return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('❌ Error deleting order:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}