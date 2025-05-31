import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { User } from '@/interfaces/user';
import type { Session } from 'next-auth';
import type { OrderRequest } from '@/interfaces/order';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
    const session = (await getServerSession(authOptions as any)) as Session & { user: User };
    if (!session?.user) return null;
    return session;
}

// GET /api/orders — Admin-only: returns paginated list of orders with sales count
export async function GET(req: Request) {
    const session = await isAdminSession();

    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        const where = {
            orderItems: {
                some: {
                    product: {
                        name: { contains: search, mode: 'insensitive' as const },
                    },
                },
            },
        };

        const [orders, total] = await Promise.all([prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        }), prisma.order.count({ where })]);

        return NextResponse.json({
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('❌ Failed to fetch orders:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/orders — Admin-only: creates a new order after validation & image upload
export async function POST(req: Request) {
    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = (await req.json()) as OrderRequest;
        const { orderItems, discount = 0, status = 'PENDING' } = body;

        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            return NextResponse.json({ message: 'Missing or invalid order items' }, { status: 400 });
        }

        // 🧠 1. Validate stock before proceeding
        for (const item of orderItems) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                return NextResponse.json({ message: `Product ${item.productId} not found` }, { status: 404 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
                }, { status: 400 });
            }
        }

        // 🧠 2. Calculate subtotal, total
        let subtotal = 0;
        const items = orderItems.map((item) => {
            const totalItem = item.quantity * item.price;
            subtotal += totalItem;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: totalItem,
            };
        });
        const total = Math.max(0, subtotal - discount);

        // 🔁 3. Use transaction to create order and update stock
        const order = await prisma.$transaction(async (tx: any) => {
            const createdOrder = await tx.order.create({
                data: {
                    status,
                    total,
                    discount,
                    orderItems: {
                        create: items,
                    },
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (status === 'COMPLETED') {
                for (const item of orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            }

            return createdOrder;
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('❌ Failed to create order:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}