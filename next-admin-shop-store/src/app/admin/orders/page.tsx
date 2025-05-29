'use client';

import OrdersDialog from '@/components/admin-ui/orders/orders-dialog';
import OrdersList from '@/components/admin-ui/orders/orders-list';
import OrdersToolbar from '@/components/admin-ui/orders/orders-toolbar';
import Loading from '@/app/loading';
import DeleteDialog from '@/components/ui/delete-dialog';
import Pagination from '@/components/ui/pagination';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { useOrdersStore } from '@/stores/orders.store';

export default function OrdersPage() {
  const { t } = useTranslation();
  const { status } = useSession();

  // Selected only the state we need:
  const { page, total, search, openDialog, openDeleteDialog, deleteData, error, setPage, setOpenDialog, setOpenDeleteDialog, deleteOrder } = useOrdersStore();
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);

  // Fetch once whenever page or search change:
  useEffect(() => {
    fetchOrders({ page, search });
  }, [page, search]);

  // Show an error toast whenever `error` changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle delete user
  const handleDelete = async () => {
    if (deleteData?.id) {
      try {
        const res = await deleteOrder(deleteData.id);
        if (res) {
          toast.success(t('components.admin-ui.orders.messages.delete-order-success'));
        } else {
          toast.error(t('components.admin-ui.orders.messages.delete-order-error'));
        }
      } catch (error) {
        toast.error(t('components.admin-ui.orders.messages.delete-order-error'));
      }
    }
    setOpenDeleteDialog(false);
  };

  // Show loading state
  if (status === 'loading') return <Loading />;

  // Render the page
  return (
    <div className="flex h-full flex-col justify-between space-y-4 p-4">
      <OrdersToolbar />
      <OrdersList />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />
      <OrdersDialog setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <DeleteDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} message={t('components.admin-ui.orders.messages.delete-order')} title={t('components.admin-ui.orders.messages.delete-order-title')} action={t('components.admin-ui.orders.messages.delete-order-action')} cancel={t('components.admin-ui.orders.messages.delete-order-cancel')} onConfirm={handleDelete} />
    </div>
  );
}
