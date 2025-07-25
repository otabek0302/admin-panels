import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EMAIL_REGEX, ALLOWED_ROLES } from '@/lib/constants';

import type { Session } from 'next-auth';
import type { User } from '@/interfaces/user';

// Helper to check admin access
async function isAdminSession(): Promise<(Session & { user: User }) | null> {
  const session = (await getServerSession(authOptions as any)) as Session & { user: User };
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

// GET /api/users/:id — get user by ID
export async function GET(_: Request, context: { params: { id: string } }) {
  const id = context?.params?.id;
  if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

  const session = await isAdminSession();

  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', (error as Error).message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/users/:id — update user
export async function PUT(req: Request, context: { params: { id: string } }) {
  const id = context?.params?.id;
  if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

  const session = await isAdminSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { name, email, role, password, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    const data: Partial<User> = { name, email, phone };

    if (role && !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }
    if (role) {
      data.role = role;
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('❌ Error fetching user:', (error as Error).message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/users/:id/password — update user password
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const session = await getServerSession(authOptions as any);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) return NextResponse.json({ message: 'Invalid current password' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { password: hashedPassword } });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Error updating password:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/users/:id — delete user
export async function DELETE(_: Request, context: { params: { id: string } }) {
  const id = context?.params?.id;
  if (!id) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

  const session = await isAdminSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error deleting user:', (error as Error).message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
