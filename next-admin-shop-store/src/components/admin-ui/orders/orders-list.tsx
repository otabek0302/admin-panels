'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useOrdersStore } from '@/stores/orders.store';

import OrdersListMobileView from './orders-list-mobile-view';
import OrdersListDesktopView from './orders-list-desktop-view';

export default function OrdersList() {
  const { orders, loading, error } = useOrdersStore();

  // Show an error toast whenever `error` changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="mt-4 h-full rounded-md border">
      {/* Mobile Card/List Layout */}
      <OrdersListMobileView orders={orders} loading={loading} />

      {/* Desktop Table/List Layout */}
      <OrdersListDesktopView orders={orders} loading={loading} />
    </div>
  );
}
