'use client';

import UsersDialog from '@/components/admin-ui/users/users-dialog';
import UsersList from '@/components/admin-ui/users/users-list';
import UsersToolbar from '@/components/admin-ui/users/users-toolbar';
import Loading from '@/app/loading';
import DeleteDialog from '@/components/ui/delete-dialog';
import Pagination from '@/components/ui/pagination';

import { useUsersStore } from '@/stores/users.store';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

export default function UsersPage() {
  const { t } = useTranslation();
  const { status } = useSession();

  // Selected only the state we need:
  const { page, total, search, openDialog, openDeleteDialog, deleteData, error, fetchUsers, setPage, setOpenDialog, setOpenDeleteDialog, deleteUser } = useUsersStore();

  // Fetch once whenever page or search change:
  useEffect(() => {
    fetchUsers({ page, search });
  }, [page, search]);

  // Show an error toast whenever `error` changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  // Handle delete user
  const handleDelete = () => {
    if (deleteData?.id) {
      deleteUser(deleteData.id);
      toast.success(t('components.admin-ui.users.users-list.messages.delete-user-success'));
    }
    setOpenDeleteDialog(false);
  };

  // Show loading state
  if (status === 'loading') return <Loading />;

  // Render the page
  return (
    <div className="flex h-full flex-col justify-between space-y-4 p-4">
      <UsersToolbar />
      <UsersList />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />
      <UsersDialog setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <DeleteDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} message={t('components.admin-ui.users.users-list.messages.delete-user')} title={t('components.admin-ui.users.users-list.messages.delete-user-title')} action={t('components.admin-ui.users.users-list.messages.delete-user-action')} cancel={t('components.admin-ui.users.users-list.messages.delete-user-cancel')} onConfirm={handleDelete} />
    </div>
  );
}
