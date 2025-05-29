import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { UsersListSkeleton } from './users-skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/interfaces/user';
import { useUsersStore } from '@/stores/users.store';

const UsersListDesktopView = ({ users, loading }: { users: User[]; loading: boolean }) => {
  const { t } = useTranslation();
  const { setOpenDialog, setEditData, setDeleteData, setOpenDeleteDialog } = useUsersStore();

  const handleEdit = (user: User) => {
    setEditData(user);
    setOpenDialog(true);
  };

  const handleDelete = (user: User) => {
    setDeleteData(user);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="hidden md:block">
      <Table className="h-full border-collapse overflow-hidden rounded-lg border-gray-200 dark:border-gray-700">
        <TableHeader className="sticky top-0 bg-background">
          <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.users.users-list.table-header.id')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.users.users-list.table-header.name')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.users.users-list.table-header.email')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.users.users-list.table-header.role')}</TableHead>
            <TableHead className="hidden px-6 text-sm font-bold text-gray-700 dark:text-gray-300 md:table-cell">{t('components.admin-ui.users.users-list.table-header.created')}</TableHead>
            <TableHead className="px-6 text-center text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.users.users-list.table-header.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {loading && [1, 2, 3, 4, 5].map((_, index) => <UsersListSkeleton key={index} />)}
          {!loading && users.length === 0 && (
            <TableRow className="h-24 hover:bg-transparent">
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                  <span className="text-lg font-semibold">{t('components.admin-ui.users.users-list.messages.no-users')}</span>
                  <p className="mt-1 text-sm">{t('components.admin-ui.users.users-list.messages.try-adjusting-filters')}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            users.length > 0 &&
            users.map((user) => (
              <TableRow key={user.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.id?.slice(-6)}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.name}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.email}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.role}</TableCell>
                <TableCell className="hidden px-6 text-sm font-normal text-muted-foreground md:table-cell">{formatDistanceToNow(new Date(user.createdAt ?? ''), { addSuffix: true })}</TableCell>
                <TableCell className="flex items-center justify-center gap-2 px-2 text-sm font-normal text-muted-foreground md:px-6">
                  <Button variant="outline" size="icon" className="cursor-pointer shadow-none" onClick={() => handleEdit(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="cursor-pointer shadow-none" onClick={() => handleDelete(user)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersListDesktopView;
