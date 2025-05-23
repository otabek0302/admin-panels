import Link from 'next/link';

import { Database, LogOut } from 'lucide-react';
import { Button } from './button';
import { signOut, useSession } from 'next-auth/react';

export const HeaderActions = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-2">
      {session?.user?.role.toLowerCase() === 'admin' && (
        <Button variant="outline" size="icon" asChild className='rounded-lg cursor-pointer'>
          <Link href="/admin">
            <Database className="text-primary size-4" />
          </Link>
        </Button>
      )}
      <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-lg cursor-pointer">
        <LogOut className="size-4 text-red-500" />
      </Button>
    </div>
  );
};
