'use client';

import CategoriesDialog from '@/components/admin-ui/categories/categories-dialog';
import CategoriesList from '@/components/admin-ui/categories/categories-list';
import CategoriesToolbar from '@/components/admin-ui/categories/categories-toolbar';
import Loading from '@/app/loading';
import DeleteDialog from '@/components/ui/delete-dialog';
import Pagination from '@/components/ui/pagination';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { useCategoriesStore } from '@/stores/categories.store';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { status } = useSession();

  // Selected only the state we need:
  const { page, total, search, openDialog, openDeleteDialog, deleteData, error, setPage, setOpenDialog, setOpenDeleteDialog, deleteCategory } = useCategoriesStore();
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  // Fetch once whenever page or search change:
  useEffect(() => {
    fetchCategories({ page, search });
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
        const res = await deleteCategory(deleteData.id);
        if (res.status === 200) {
          toast.success(t('components.admin-ui.categories.categories-list.messages.delete-category-success'));
        } else {
          toast.error(t('components.admin-ui.categories.categories-list.messages.delete-category-error'));
        }
      } catch (error) {
        toast.error(t('components.admin-ui.categories.categories-list.messages.delete-category-error'));
      }
    }
    setOpenDeleteDialog(false);
  };

  // Show loading state
  if (status === 'loading') return <Loading />;

  // Render the page
  return (
    <div className="flex h-full flex-col justify-between space-y-4 p-4">
      <CategoriesToolbar />
      <CategoriesList />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />
      <CategoriesDialog setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <DeleteDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} message={t('components.admin-ui.categories.categories-list.messages.delete-category')} title={t('components.admin-ui.categories.categories-list.messages.delete-category-title')} action={t('components.admin-ui.categories.categories-list.messages.delete-category-action')} cancel={t('components.admin-ui.categories.categories-list.messages.delete-category-cancel')} onConfirm={handleDelete} />
    </div>
  );
}