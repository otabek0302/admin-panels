'use client';

import { Category } from '@/interfaces/category';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoriesStore } from '@/stores/categories.store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SelectProductCategory = ({ 
  category, 
  setCategory,
  disabled 
}: { 
  category: string | Category; 
  setCategory: (category: string) => void;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();

  const { categories } = useCategoriesStore();
  const fetchAllCategories = useCategoriesStore((state) => state.fetchAllCategories);

  const categoryId = typeof category === 'string' ? category : category?.id;

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="category">{t('components.admin-ui.products.products-dialog.category-label')}</Label>
      <Select value={categoryId} onValueChange={setCategory} disabled={disabled}>
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder={t('components.admin-ui.products.products-dialog.category-placeholder')} />
        </SelectTrigger>
        <SelectContent className="w-full h-[400px]">
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectProductCategory;
