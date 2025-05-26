import bcrypt from 'bcryptjs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EMAIL_REGEX, ALLOWED_ROLES } from '@/lib/constants';

import type { User, UserRequest } from '@/interfaces/user';
import type { Session } from 'next-auth';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
  const session = (await getServerSession(authOptions as any)) as Session & { user: User };
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

// GET /api/users — Admin-only: returns paginated list of users
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
      OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('❌ Failed to fetch users:', (error as Error).message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/users — Admin-only: creates a new user after validation
export async function POST(req: Request) {
  const session = await isAdminSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as UserRequest;
    const { name, email, role, password, phone } = body;

    if (!name || !email || !role || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('❌ Failed to create user:', (error as Error).message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
