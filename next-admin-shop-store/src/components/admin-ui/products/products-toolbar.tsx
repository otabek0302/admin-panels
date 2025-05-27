'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductsStore } from '@/stores/product.store';
import { useTranslation } from 'react-i18next';

const ProductsToolbar = () => {
  const { t } = useTranslation();
  const { search, setSearch, setOpenDialog, setEditData } = useProductsStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddProduct = () => {
    setOpenDialog(true);
    setEditData(null);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Input placeholder={t('components.admin-ui.products.products-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 lg:w-[250px]" />
      <Button onClick={handleAddProduct} className="cursor-pointer dark:bg-gray-800 dark:text-white">
        {t('components.admin-ui.products.products-toolbar.add-product')}
      </Button>
    </div>
  );
};

export default ProductsToolbar;