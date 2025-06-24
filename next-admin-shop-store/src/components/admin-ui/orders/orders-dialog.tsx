'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrdersStore } from '@/stores/orders.store';
import { useProductsStore } from '@/stores/product.store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';

import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { OrderStatus } from '@prisma/client';
import { Search, Package, Loader2 } from 'lucide-react';
import { ProductCard } from './product-card';
import { OrderCard } from './order-card';
import { OrderItem, OrderRequest } from '@/interfaces/order';

const OrdersDialog = ({ openDialog, setOpenDialog }: { openDialog: boolean; setOpenDialog: (open: boolean) => void }) => {
  const { t } = useTranslation();
  const { loading, editData, setEditData, orderItems, total, discount, setDiscount, addOrderItem, removeOrderItem, updateOrderItem, createOrder, updateOrder, reset, fetchOrders, setOrderItems, setSubtotal } = useOrdersStore();

  const { products, fetchProducts, loading: productsLoading } = useProductsStore();
  
  const [discountInput, setDiscountInput] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(productSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [productSearch]);

  useEffect(() => {
    if (openDialog) {
      fetchProducts({ search: debouncedSearch });
    }
  }, [openDialog, fetchProducts, debouncedSearch]);

  useEffect(() => {
    if (!openDialog) {
      reset();
      setDiscountInput('');
      setProductSearch('');
      setDebouncedSearch('');
    }
  }, [openDialog, reset]);

  useEffect(() => {
    // Pre-populate order items and discount when editing an order
    if (openDialog && editData) {
      setOrderItems(editData.orderItems || []);
      setDiscount(editData.discount || 0);
      // Optionally, set subtotal and total based on the order items and discount
      const subtotal = editData.orderItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
      setSubtotal(subtotal);
      // setDiscount will update total automatically in the store logic
    }
    // Do not run on create or when dialog is closed
    // eslint-disable-next-line
  }, [openDialog, editData]);

  const handleSubmit = async () => {
    if (!orderItems.length) {
      toast.error(t('components.admin-ui.orders.messages.no-items'));
      return;
    }
    try {
      const orderData: OrderRequest = {
        orderItems,
        total,
        discount,
        status: 'PENDING' as OrderStatus,
      };

      if (editData) {
        await updateOrder({ ...orderData, id: editData.id });
        toast.success(t('components.admin-ui.orders.messages.update-order-success'));
      } else {
        await createOrder(orderData);
        toast.success(t('components.admin-ui.orders.messages.create-order-success'));
      }
      setOpenDialog(false);
      setEditData(null);
      fetchOrders();
    } catch (err) {
      toast.error(t('components.admin-ui.orders.messages.save-failed'));
    }
  };

  const handleApplyDiscount = () => {
    const value = parseFloat(discountInput);
    if (!isNaN(value) && value >= 0) {
      setDiscount(value);
      setDiscountInput('');
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="no-scrollbar h-[90vh] w-full max-w-md overflow-y-auto sm:rounded-lg md:h-[95vh] md:max-w-5xl">
        <DialogTitle>{editData ? t('components.admin-ui.orders.orders-dialog.edit-title') : t('components.admin-ui.orders.orders-dialog.add-title')}</DialogTitle>
        <DialogDescription>{editData ? t('components.admin-ui.orders.orders-dialog.edit-desc') : t('components.admin-ui.orders.orders-dialog.add-desc')}</DialogDescription>

        <div className="flex w-full flex-col border md:h-[480px] md:flex-row">
          {/* Left Panel - Product Selection */}
          <div className="max-w-1/2 flex h-[480px] flex-1 flex-col p-4 md:h-full">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5 text-primary" />
                {t('components.admin-ui.orders.orders-dialog.products')}
              </h3>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {products.length || 0} {t('components.admin-ui.orders.orders-dialog.items')}
              </Badge>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input placeholder={t('components.admin-ui.orders.orders-dialog.search-placeholder')} value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="h-11 bg-background pl-9 pr-10" />
              {productSearch && (
                <button type="button" aria-label={t('clear search')} onClick={() => setProductSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="6" x2="14" y2="14" />
                    <line x1="14" y1="6" x2="6" y2="14" />
                  </svg>
                </button>
              )}
            </div>

            <ScrollArea className="no-scrollbar h-[calc(100%-8rem)] flex-1">
              {productsLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 px-2">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAdd={addOrderItem} isInCart={orderItems.some((item) => item.productId === product.id)} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <Divider orientation="vertical" className="h-0 md:h-full" />

          {/* Right Panel - Order Items */}
          <div className="max-w-1/2 flex h-[480px] flex-1 flex-col p-4 md:h-full">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5 text-primary" />
                {t('components.admin-ui.orders.orders-dialog.order-items')}
              </h3>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {orderItems.length || 0} {t('components.admin-ui.orders.orders-dialog.items')}
              </Badge>
            </div>

            <ScrollArea className="no-scrollbar h-[calc(100%-8rem)] flex-1">
              <div className="space-y-4 px-2">
                {orderItems.map((item: OrderItem, index: number) => (
                  <OrderCard key={index} item={item} index={index} updateOrderItem={updateOrderItem} removeOrderItem={(index) => removeOrderItem(orderItems[index].productId)} availableStock={item.product.stock} />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="border px-3 py-2 md:border-t md:px-4">
          {/* Discount input section */}
          <div className="mb-6">
            <label htmlFor="discount-amount" className="mb-1 block text-sm font-medium">
              {t('components.admin-ui.orders.orders-dialog.discount-label')}
            </label>
            <div className="flex">
              <Input id="discount-amount" type="text" min="0" step="0.01" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} placeholder={t('components.admin-ui.orders.orders-dialog.discount-placeholder')} className="rounded-r-none border-none outline-none focus:outline-none focus:ring-0" />
              <Button className="cursor-pointer rounded-l-none dark:bg-gray-800 dark:text-white" onClick={handleApplyDiscount} type="button">
                {t('components.admin-ui.orders.orders-dialog.apply-discount')}
              </Button>
            </div>
            {discount > 0 && <p className="mt-1 flex items-center gap-1 text-sm text-green-600">{t('components.admin-ui.orders.orders-dialog.discount-applied', { discount: discount.toLocaleString() })}</p>}
          </div>

          {/* Summary pricing */}
          <div className="mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('components.admin-ui.orders.orders-dialog.subtotal')}</span>
              <span className="flex items-center gap-1">{orderItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t('components.admin-ui.orders.orders-dialog.discount')}</span>
                <span className="flex items-center gap-1">-{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>{t('components.admin-ui.orders.orders-dialog.total')}</span>
              <span className="flex items-center gap-1 text-primary">{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} className="h-11 cursor-pointer px-6">
              {t('components.admin-ui.orders.orders-dialog.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !orderItems.length} onClick={handleSubmit} className="h-11 cursor-pointer px-6 dark:bg-gray-800 dark:text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('components.admin-ui.orders.orders-dialog.saving')}
                </>
              ) : editData ? (
                t('components.admin-ui.orders.orders-dialog.update')
              ) : (
                t('components.admin-ui.orders.orders-dialog.create')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersDialog;
