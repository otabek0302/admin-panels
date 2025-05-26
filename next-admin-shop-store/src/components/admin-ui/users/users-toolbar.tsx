'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUsersStore } from '@/stores/users.store';
import { useTranslation } from 'react-i18next';

const UsersToolbar = () => {
  const { t } = useTranslation();
  const { search, setSearch, setOpenDialog } = useUsersStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddUser = () => {
    setOpenDialog(true);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Input placeholder={t('components.admin-ui.users.users-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 lg:w-[250px]" />
      <Button onClick={handleAddUser} className="cursor-pointer dark:bg-gray-800 dark:text-white">
        {t('components.admin-ui.users.users-toolbar.add-user')}
      </Button>
    </div>
  );
};

export default UsersToolbar;
