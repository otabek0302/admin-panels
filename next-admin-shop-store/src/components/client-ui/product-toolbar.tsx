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
      <Input placeholder={t('components.client-ui.product-list.search')} value={search} onChange={handleFilterChange} className="h-10" />
    </div>
  );
};
