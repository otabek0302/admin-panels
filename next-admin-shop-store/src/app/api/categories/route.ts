import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { User } from '@/interfaces/user';
import type { Session } from 'next-auth';
import type { CategoryRequest } from '@/interfaces/category';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
    const session = (await getServerSession(authOptions as any)) as Session & { user: User };
    if (!session?.user || session.user.role !== 'ADMIN') return null;
    return session;
}

// GET /api/categories — Admin-only: returns paginated list of categories
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
            OR: [{ name: { contains: search, mode: 'insensitive' } }],
        };

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.category.count({ where }),
        ]);

        return NextResponse.json({
            categories,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('❌ Failed to fetch categories:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/categories — Admin-only: creates a new category after validation
export async function POST(req: Request) {
    const session = await isAdminSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = (await req.json()) as CategoryRequest;
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const existingCategory = await prisma.category.findUnique({ where: { name } });

        if (existingCategory) {
            return NextResponse.json({ message: 'Category already exists' }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        });

        return NextResponse.json(newCategory);
    } catch (error) {
        console.error('❌ Failed to create category:', (error as Error).message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
