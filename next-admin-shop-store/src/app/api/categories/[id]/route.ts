import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { Session, User } from 'next-auth';
import type { Category } from '@/interfaces/category';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
    const session = (await getServerSession(authOptions as any)) as Session & { user: User };
    if (!session?.user || session.user.role !== 'ADMIN') return null;
    return session;
}

// GET /api/categories/:id — get category by ID
export async function GET(_: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();

    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        });

        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('❌ Error fetching category:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/categories/:id — update category
export async function PUT(req: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const data: Partial<Category> = { name };

        const updatedCategory = await prisma.category.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error('❌ Error fetching category:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/categories/:id — delete category
export async function DELETE(_: Request, context: { params: { id: string } }) {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
    } catch (error) {
        console.error('❌ Error deleting category:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
