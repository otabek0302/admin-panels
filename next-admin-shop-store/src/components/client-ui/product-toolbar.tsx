import { Input } from '@/components/ui/input';
import { useProductsStore } from '@/stores/product.store';
import { useTranslation } from 'react-i18next';

export const ProductToolbar = () => {
  const { t } = useTranslation();

  const { search, setSearch, fetchProducts } = useProductsStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchProducts();
  };

  return (
    <div className="pb-4">
      <div className="relative">
        <Input
          placeholder={t('components.client-ui.product-list.search')}
          value={search}
          onChange={handleFilterChange}
          className="h-10 pr-10"
        />
        {search && (
          <button
            type="button"
            aria-label={t('clear search')}
            onClick={() => {
              setSearch('');
              fetchProducts();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="6" x2="14" y2="14" /><line x1="14" y1="6" x2="6" y2="14" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};
