'use client';

import ProductsDialog from '@/components/admin-ui/products/products-dialog';
import ProductsList from '@/components/admin-ui/products/products-list';
import ProductsToolbar from '@/components/admin-ui/products/products-toolbar';
import Loading from '@/app/loading';
import DeleteDialog from '@/components/ui/delete-dialog';
import Pagination from '@/components/ui/pagination';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { useProductsStore } from '@/stores/product.store';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { status } = useSession();

  // Selected only the state we need:
  const { page, total, search, openDialog, openDeleteDialog, deleteData, error, setPage, setOpenDialog, setOpenDeleteDialog, deleteProduct } = useProductsStore();
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  // Fetch once whenever page or search change:
  useEffect(() => {
    fetchProducts({ page, search });
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
      const res = await deleteProduct(deleteData.id);
      if (res.status === 200) {
        toast.success(t('components.admin-ui.products.messages.delete-product-success'));
      } else {
        toast.error(t('components.admin-ui.products.messages.delete-product-error'));
      }
    }
    setOpenDeleteDialog(false);
  };

  // Show loading state
  if (status === 'loading') return <Loading />;

  // Render the page
  return (
    <div className="flex h-full flex-col justify-between space-y-4 p-4">
      <ProductsToolbar />
      <ProductsList />
      <Pagination page={page} setPage={setPage} total={total} perPage={15} />
      <ProductsDialog setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <DeleteDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} message={t('components.admin-ui.products.messages.delete-product')} title={t('components.admin-ui.products.messages.delete-product-title')} action={t('components.admin-ui.products.messages.delete-product-action')} cancel={t('components.admin-ui.products.messages.delete-product-cancel')} onConfirm={handleDelete} />
    </div>
  );
}
