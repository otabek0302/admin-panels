'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrdersStore } from '@/stores/orders.store';
import { useTranslation } from 'react-i18next';

const OrdersToolbar = () => {
  const { t } = useTranslation();
  const { search, setSearch, setOpenDialog, setEditData } = useOrdersStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddOrder = () => {
    setOpenDialog(true);
    setEditData(null);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Input placeholder={t('components.admin-ui.orders.orders-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 lg:w-[250px]" />
      <Button onClick={handleAddOrder} className="cursor-pointer dark:bg-gray-800 dark:text-white">
        {t('components.admin-ui.orders.orders-toolbar.add-order')}
      </Button>
    </div>
  );
};

export default OrdersToolbar;