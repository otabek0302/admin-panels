'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategoriesStore } from '@/stores/categories.store';
import { useTranslation } from 'react-i18next';

const CategoriesToolbar = () => {
  const { t } = useTranslation();
  const { search, setSearch, setOpenDialog, setEditData } = useCategoriesStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddCategory = () => {
    setOpenDialog(true);
    setEditData(null);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Input placeholder={t('components.admin-ui.categories.categories-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 lg:w-[250px]" />
      <Button onClick={handleAddCategory} className="cursor-pointer dark:bg-gray-800 dark:text-white">
        {t('components.admin-ui.categories.categories-toolbar.add-category')}
      </Button>
    </div>
  );
};

export default CategoriesToolbar;