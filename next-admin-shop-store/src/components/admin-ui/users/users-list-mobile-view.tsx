import { UsersListMobileViewSkeleton } from './users-skeleton';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { User } from '@/interfaces/user';

const UsersListMobileView = ({ users, loading }: { users: User[]; loading: boolean }) => {
  const { t } = useTranslation();

  const handleEdit = () => {
    console.log('edit');
  };

  const handleDelete = () => {
    console.log('delete');
  };

  return (
    <div className="block md:hidden">
      {loading && [1, 2, 3, 4, 5].map((_, idx) => <UsersListMobileViewSkeleton key={idx} />)}
      {!loading && users.length === 0 && (
        <div className="flex h-24 flex-col items-center justify-center text-center text-muted-foreground">
          <span className="text-lg font-semibold">{t('components.admin-ui.users.users-list.messages.no-users')}</span>
          <p className="mt-1 text-sm">{t('components.admin-ui.users.users-list.messages.try-adjusting-filters')}</p>
        </div>
      )}
      {!loading &&
        users.map((user) => (
          <div key={user.id} className="mb-4 rounded-lg border bg-white p-4 shadow-md transition hover:shadow-lg dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-base font-bold text-gray-800 dark:text-gray-100">{user.name}</span>
              <div className="flex justify-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleEdit} title={t('components.admin-ui.users.users-list.actions.edit')}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete} title={t('components.admin-ui.users.users-list.actions.delete')}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <div>
                <span className="font-medium">{t('components.admin-ui.users.users-list.table-header.email')}:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">{t('components.admin-ui.users.users-list.table-header.role')}:</span> {user.role}
              </div>
              <div>
                <span className="font-medium">{t('components.admin-ui.users.users-list.table-header.created')}:</span> {formatDistanceToNow(new Date(user.createdAt ?? ''), { addSuffix: true })}
              </div>
              <div>
                <span className="font-medium">{t('components.admin-ui.users.users-list.table-header.id')}:</span> {user.id?.slice(-6)}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UsersListMobileView;
