'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Product } from '@/interfaces/product';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useOrdersStore } from '@/stores/orders.store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const { addOrderItem, orderItems } = useOrdersStore();

  const isInCart = orderItems.some((item) => item.productId === product.id);
  const isLowStock = product?.stock > 0 && product?.stock <= 5;

  const getStockBadgeVariant = () => {
    if (product?.stock <= 0) return 'destructive';
    if (product?.stock <= 5) return 'secondary';
    return 'outline';
  };

  const getStockMessage = () => {
    if (product?.stock <= 0) return t('messages.error.out-of-stock');
    if (product?.stock <= 5) return t('messages.error.low-stock', { count: product?.stock });
    return t('messages.error.in-stock', { count: product?.stock });
  };

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
            <Image src={product?.image?.url} alt={product?.name} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold">{product?.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(product?.price)}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={getStockBadgeVariant()} className="mt-1">
                    {getStockMessage()}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{product?.stock <= 0 ? t('messages.error.out-of-stock') : product?.stock <= 5 ? t('messages.error.low-stock', { count: product?.stock }) : t('messages.error.in-stock', { count: product?.stock })}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button size="icon" variant="outline" onClick={() => addOrderItem(product)} className="h-9 w-9 cursor-pointer rounded-full" disabled={isInCart || product?.stock <= 0} aria-label="Add to order">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
