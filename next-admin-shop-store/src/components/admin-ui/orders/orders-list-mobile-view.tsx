'use client';

import Image from 'next/image';
import { Pencil, Trash } from 'lucide-react';

import { Order, OrderItem } from '@/interfaces/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderMobileViewSkeleton } from './orders-skeleton';
import { useTranslation } from 'react-i18next';
import { useOrdersStore } from '@/stores/orders.store';
import { getStatusColor } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { OrderStatus } from '@prisma/client';

const OrdersListMobileView = ({ orders, loading }: { orders: Order[]; loading: boolean }) => {
  const { t } = useTranslation();
  const { setOpenDialog, setEditData, setDeleteData, setOpenDeleteDialog } = useOrdersStore();

  const handleEdit = (order: Order) => {
    setEditData(order);
    setOpenDialog(true);
  };

  const handleDelete = (order: Order) => {
    setDeleteData(order);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="block md:hidden">
      {loading && [1, 2, 3, 4, 5].map((_, index) => <OrderMobileViewSkeleton key={index} />)}

      {!loading && orders.length === 0 && (
        <div className="flex h-24 flex-col items-center justify-center text-center text-muted-foreground">
          <span className="text-lg font-semibold">{t('components.admin-ui.order.order-list.messages.no-orders')}</span>
          <p className="mt-1 text-sm">{t('components.admin-ui.order.order-list.messages.try-adjusting-filters')}</p>
        </div>
      )}

      {!loading &&
        orders.length > 0 &&
        orders.map((order) => (
          <div key={order.id} className="mb-4 rounded-lg border bg-white p-4 shadow-md transition hover:shadow-lg dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-base font-bold text-gray-800 dark:text-gray-100">#{order.id?.slice(-6)}</span>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleEdit(order)}>
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleDelete(order)}>
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="mb-2 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="font-medium">{t('components.admin-ui.orders.orders-list.table-header.status')}:</span>
                <Badge className={getStatusColor(order.status as OrderStatus)}>{order.status}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{t('components.admin-ui.orders.orders-list.table-header.total')}:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{order.total.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{t('components.admin-ui.orders.orders-list.table-header.created')}:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{order.createdAt ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }) : 'N/A'}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 overflow-y-auto border-t pt-2">
              {order.orderItems.map((item: OrderItem) => (
                <div key={item.id} className="flex flex-col items-center rounded-sm border p-1.5">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    {item.product?.image?.url ? <Image src={item.product.image.url} alt={item.product?.name || ''} fill sizes="(max-width: 768px) 100vw" priority className="object-cover object-center" /> : <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">No Image</div>}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                      <span className="text-xs font-medium text-white">{item.quantity}×</span>
                    </div>
                  </div>
                  <span className="mt-1 line-clamp-1 text-center text-[10px]">{item.product.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrdersListMobileView;