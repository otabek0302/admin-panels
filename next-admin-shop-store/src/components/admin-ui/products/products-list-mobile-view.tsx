import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useProductsStore } from '@/stores/product.store';
import { Product } from '@/interfaces/product';
import { ProductsListMobileViewSkeleton } from './products-skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

const ProductsListMobileView = ({ products, loading }: { products: Product[]; loading: boolean }) => {
  const { t } = useTranslation();
  const { setOpenDialog, setEditData, setDeleteData, setOpenDeleteDialog } = useProductsStore();

  const handleEdit = (product: Product) => {
    setEditData(product);
    setOpenDialog(true);
  };

  const handleDelete = (product: Product) => {
    setDeleteData(product);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="block space-y-4 lg:hidden">
      {loading && [1, 2, 3].map((item) => <ProductsListMobileViewSkeleton key={`mobile-skeleton-${item}`} />)}

      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <span className="text-lg font-semibold">{t('components.admin-ui.products.messages.no-products')}</span>
          <p className="mt-1 text-sm">{t('components.admin-ui.products.messages.try-adjusting-filters')}</p>
        </div>
      )}

      {!loading &&
        products.length > 0 &&
        products.map((product) => (
          <Card key={product.id} className="w-full space-y-3 overflow-hidden rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-1 gap-3">
                <div className="relative h-24 w-24 overflow-hidden rounded-md border border-border">
                  {product?.image?.url ? (
                    <Image src={product.image.url} alt={product?.name || ''} fill sizes="(max-width: 768px) 100vw" priority className="object-cover object-center" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center space-y-1">
                  <h2 className="text-sm font-bold">{product?.name}</h2>
                  <p className="text-xs font-normal">{typeof product?.category === 'object' ? product?.category?.name : product?.category}</p>
                  <p className="text-xs font-normal">{formatCurrency(product?.price)}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer rounded-full" onClick={() => handleEdit(product)}>
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer rounded-full" onClick={() => handleDelete(product)}>
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold">{t('components.admin-ui.products.products-card.summary.title')}</h3>
              <p className="text-xs font-normal text-muted-foreground">
                <span className="font-semibold">{t('components.admin-ui.products.products-card.summary.brand')}:</span> {product?.brand}
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                <span className="font-semibold">{t('components.admin-ui.products.products-card.summary.description')}:</span> {product?.description}
              </p>
            </div>

            <CardContent className="space-y-2 rounded-lg border border-border px-3 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-muted-foreground">{t('components.admin-ui.products.products-card.sales')}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-orange-500">
                  <ArrowUpRight className="h-3 w-3" />
                  {product?.sales}
                </span>
              </div>
              <hr />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-gray-700 dark:text-muted-foreground">{t('components.admin-ui.products.products-card.remaining-products')}</span>
                <Progress value={product?.stock >= 100 ? 100 : product?.stock} className="h-1.5" />
                <span className="text-xs text-muted-foreground">{product?.stock}</span>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ProductsListMobileView;
