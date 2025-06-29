'use client';

import { ProductCard } from './product-card';
import { useProductsStore } from '@/stores/product.store';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

export function ProductList() {
  const { t } = useTranslation();
  const { products, loading } = useProductsStore();
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, []);

  const LoadingSkeleton = () => (
    <div className="w-full space-y-4 overflow-hidden rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-md" />
          <div className="flex flex-col justify-center space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full space-y-6">
      <div className="no-scrollbar h-full space-y-6 overflow-y-auto">
        {loading && (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        )}

        {!loading && !products?.length && <div className="py-10 text-center text-muted-foreground">{t('components.client-ui.product-list.no-products')}</div>}

        {!loading && products?.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
