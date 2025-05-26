import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { User } from '@/interfaces/user';
import { Session } from 'next-auth';

export default async function AdminPage() {
  const session = (await getServerSession(authOptions as any)) as Session & { user: User };

  if (!session?.user || (session.user as User).role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <section className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
    </section>
  );
}
