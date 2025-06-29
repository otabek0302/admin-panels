import { Input } from '@/components/ui/input';
import { useProductsStore } from '@/stores/product.store';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export const ProductToolbar = () => {
  const { t } = useTranslation();

  const { search, setSearch } = useProductsStore();
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    fetchProducts({ search: searchValue });
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchProducts({ search: '' });
  };

  return (
    <div className="pb-4">
      <div className="relative">
        <Input placeholder={t('components.client-ui.product-list.search')} value={search} onChange={handleFilterChange} className="h-10 pr-10" />
        {search && (
          <Button type="button" variant="ghost" aria-label={t('clear search')} onClick={handleClearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-transparent focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="6" x2="14" y2="14" />
              <line x1="14" y1="6" x2="6" y2="14" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};
