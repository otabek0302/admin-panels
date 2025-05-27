'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useProductsStore } from '@/stores/product.store';

import ProductsListMobileView from './products-list-mobile-view';
import ProductsListDesktopView from './products-list-desktop-view';


export default function ProductsList() {
  // Select only the pieces of state we need
  const { products, loading, error } = useProductsStore();

  // Show an error toast whenever `error` changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="mt-4 h-full rounded-md border">
      {/* Mobile Card/List Layout */}
      <ProductsListMobileView products={products} loading={loading} />

      {/* Desktop Table/List Layout */}
      <ProductsListDesktopView products={products} loading={loading} />
    </div>
  );
}