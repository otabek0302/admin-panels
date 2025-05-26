'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import UsersListMobileView from './users-list-mobile-view';
import UsersListDesktopView from './users-list-desktop-view';
import { useUsersStore } from '@/stores/users.store';

export default function UsersList() {
  // Select only the pieces of state we need
  const { users, loading, error } = useUsersStore();

  // Show an error toast whenever `error` changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="mt-4 h-full rounded-md border">
      {/* Mobile Card/List Layout */}
      <UsersListMobileView users={users} loading={loading} />

      {/* Desktop Table/List Layout */}
      <UsersListDesktopView users={users} loading={loading} />
    </div>
  );
}
