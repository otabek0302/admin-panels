'use client';

import Image from 'next/image';
import { AlertTriangle, Minus, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useOrdersStore } from '@/stores/orders.store';
import { getStockStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { OrderItem, OrderRequest } from '@/interfaces/order';
import { formatCurrency } from '@/lib/utils';

export const Summary = () => {
  const { orderItems, discount, applyDiscount, getSubtotal, createOrder, updateOrderItem, removeOrderItem } = useOrdersStore();
  const { t } = useTranslation();

  const [discountAmount, setDiscountAmount] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  const subtotal = getSubtotal();
  const total = subtotal - discount;

  const handleApplyDiscount = () => {
    const amount = parseFloat(discountAmount);
    applyDiscount(amount);
  };

  const handleQuantityChange = (item: OrderItem, newValue: number) => {
    const index = orderItems.findIndex(i => i.productId === item.productId);
    if (newValue <= 0) {
      removeOrderItem(item.productId);
    } else if (newValue <= item.product.stock) {
      updateOrderItem(index, 'quantity', newValue);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setIsCreatingOrder(true);
      const orderRequest: OrderRequest = {
        orderItems: orderItems.map((item) => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          discount: item.discount,
          name: item.name,
          image: item.image,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        total,
        discount,
        status: 'PENDING',
      };
      await createOrder(orderRequest);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">{t('components.client-ui.summary.title')}</h2>

      {orderItems.length === 0 ? (
        <p className="my-8 text-center text-gray-500">{t('components.client-ui.summary.empty-cart')}</p>
      ) : (
        <>
          <ScrollArea className="no-scrollbar mb-6 h-[330px] space-y-4 overflow-y-auto border-y">
            {orderItems.map((item) => {
              const stockStatus = getStockStatus(item.product.stock);
              const isLowStock = item.product.stock - item.quantity <= 5;

              return (
                <Card key={item.productId} className="p-4 transition-all duration-200 hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-1 items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
                        <Image src={item.image?.url || '/placeholder.svg'} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        {isLowStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-yellow-500/10">
                            <AlertTriangle className="h-6 w-6 text-yellow-500" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-bold">{item.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant={stockStatus.variant} className="mt-1">
                                {stockStatus.message}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {stockStatus.message === 'Out of Stock' 
                                ? t('messages.error.out-of-stock') 
                                : stockStatus.message.includes('Low Stock') 
                                  ? t('messages.error.low-stock', { count: item.product.stock - item.quantity }) 
                                  : t('messages.error.in-stock', { count: item.product.stock - item.quantity })}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleQuantityChange(item, item.quantity - 1)} 
                        className="h-9 w-9 cursor-pointer rounded-full" 
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="text"
                        min="1"
                        disabled={item.quantity >= item.product.stock}
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          handleQuantityChange(item, Math.min(value, item.product.stock));
                        }}
                        className="h-9 w-16 text-center"
                        aria-label="Item quantity"
                      />
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleQuantityChange(item, item.quantity + 1)} 
                        className="h-9 w-9 cursor-pointer rounded-full" 
                        disabled={item.quantity >= item.product.stock} 
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 text-right text-sm font-medium text-primary">
                    {t('components.client-ui.summary.total')}: {formatCurrency(item.total)}
                  </div>
                </Card>
              );
            })}
          </ScrollArea>

          {/* Discount input */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="discount-amount">{t('components.client-ui.summary.discount-amount')}</Label>
            <div className="mt-1 flex">
              <Input id="discount-amount" type="text" min="0" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} placeholder={t('components.client-ui.summary.discount-amount')} className="rounded-r-none border-none outline-none focus-visible:ring-0" />
              <Button className="cursor-pointer rounded-l-none dark:bg-gray-800 dark:text-white" onClick={handleApplyDiscount}>
                {t('components.client-ui.summary.apply-discount')}
              </Button>
            </div>
            {discount > 0 && <p className="mt-1 flex items-center gap-1 text-sm text-green-600">{t('components.client-ui.summary.discount-applied', { discount: discount.toLocaleString() })}</p>}
          </div>

          {/* Summary pricing */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('components.client-ui.summary.subtotal')}</span>
              <span className="flex items-center gap-1">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t('components.client-ui.summary.discount')}</span>
                <span className="flex items-center gap-1">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>{t('components.client-ui.summary.total')}</span>
              <span className="flex items-center gap-1 text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Order button */}
          <Button 
            className="mt-6 w-full cursor-pointer dark:bg-gray-800 dark:text-white" 
            size="lg" 
            onClick={handleCreateOrder} 
            disabled={orderItems.length === 0 || isCreatingOrder}
          >
            {isCreatingOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('components.client-ui.summary.creating-order')}
              </>
            ) : (
              t('components.client-ui.summary.create-order')
            )}
          </Button>
        </>
      )}
    </Card>
  );
};