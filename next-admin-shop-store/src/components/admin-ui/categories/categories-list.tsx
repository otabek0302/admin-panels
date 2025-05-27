'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useCategoriesStore } from '@/stores/categories.store';

import CategoriesListMobileView from './categories-list-mobile-view';
import CategoriesListDesktopView from './categories-list-desktop-view';


export default function CategoriesList() {
  // Select only the pieces of state we need
  const { categories, loading, error } = useCategoriesStore();

  // Show an error toast whenever `error` changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="mt-4 h-full rounded-md border">
      {/* Mobile Card/List Layout */}
      <CategoriesListMobileView categories={categories} loading={loading} />

      {/* Desktop Table/List Layout */}
      <CategoriesListDesktopView categories={categories} loading={loading} />
    </div>
  );
}