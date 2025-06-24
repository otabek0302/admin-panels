'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductsStore } from '@/stores/product.store';
import { useTranslation } from 'react-i18next';

const ProductsToolbar = () => {
  const { t } = useTranslation();
  const { search, setSearch, setOpenDialog, setEditData, setPage } = useProductsStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    // Reset to first page when search changes
    setPage(1);
  };

  const handleAddProduct = () => {
    setOpenDialog(true);
    setEditData(null);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative lg:w-[250px] w-full">
        <Input 
          placeholder={t('components.admin-ui.products.products-toolbar.search')} 
          value={search} 
          onChange={handleFilterChange} 
          className="h-10 pr-10 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 [&:focus-visible]:shadow-none overflow-hidden" 
        />
        {search && (
          <button
            type="button"
            aria-label={t('clear search')}
            onClick={() => {
              setSearch('');
              setPage(1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="6" x2="14" y2="14" /><line x1="14" y1="6" x2="6" y2="14" /></svg>
          </button>
        )}
      </div>
      <Button onClick={handleAddProduct} className="cursor-pointer dark:bg-gray-800 dark:text-white">
        {t('components.admin-ui.products.products-toolbar.add-product')}
      </Button>
    </div>
  );
};

export default ProductsToolbar;