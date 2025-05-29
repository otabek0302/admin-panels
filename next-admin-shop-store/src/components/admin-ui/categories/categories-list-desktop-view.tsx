import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { CategoriesListSkeleton } from './categories-skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/interfaces/category';
import { useCategoriesStore } from '@/stores/categories.store';

const CategoriesListDesktopView = ({ categories, loading }: { categories: Category[]; loading: boolean }) => {
  const { t } = useTranslation();
  const { setOpenDialog, setEditData, setDeleteData, setOpenDeleteDialog } = useCategoriesStore();

  const handleEdit = (category: Category) => {
    setEditData(category);
    setOpenDialog(true);
  };

  const handleDelete = (category: Category) => {
    setDeleteData(category);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="hidden md:block">
      <Table className="h-full border-collapse overflow-hidden rounded-lg border-gray-200 dark:border-gray-700">
        <TableHeader className="sticky top-0 bg-background">
          <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.categories.categories-list.table-header.id')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.categories.categories-list.table-header.name')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.categories.categories-list.table-header.created')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.categories.categories-list.table-header.updated')}</TableHead>
            <TableHead className="px-6 text-center text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.categories.categories-list.table-header.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {loading && [1, 2, 3, 4, 5].map((_, index) => <CategoriesListSkeleton key={index} />)}
          {!loading && categories.length === 0 && (
            <TableRow className="h-24 hover:bg-transparent">
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                  <span className="text-lg font-semibold">{t('components.admin-ui.categories.categories-list.messages.no-categories')}</span>
                  <p className="mt-1 text-sm">{t('components.admin-ui.categories.categories-list.messages.try-adjusting-filters')}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            categories.length > 0 &&
            categories.map((category) => (
              <TableRow key={category.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{category.id?.slice(-6)}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{category.name}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{category.createdAt ? formatDistanceToNow(new Date(category.createdAt), { addSuffix: true }) : '-'}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{category.updatedAt ? formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true }) : '-'}</TableCell>
                <TableCell className="px-2 flex items-center justify-center gap-2 text-sm font-normal text-muted-foreground md:px-6">
                  <Button variant="outline" size="icon" className="shadow-none cursor-pointer" onClick={() => handleEdit(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="shadow-none cursor-pointer" onClick={() => handleDelete(category)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesListDesktopView;
