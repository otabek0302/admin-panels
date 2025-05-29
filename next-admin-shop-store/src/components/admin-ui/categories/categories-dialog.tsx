'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/interfaces/category';
import { useCategoriesStore } from '@/stores/categories.store';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const CategoriesDialog = ({ setOpenDialog, openDialog }: { setOpenDialog: (open: boolean) => void; openDialog: boolean }) => {
  const { t } = useTranslation();
  const { editData, updateCategory, createCategory, setEditData, loading } = useCategoriesStore();

  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id,
        name: editData.name,
        createdAt: editData.createdAt,
        updatedAt: editData.updatedAt,
      });
    } else {
      setFormData({
        id: '',
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [editData, openDialog]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editData) {
      const res = await updateCategory(formData);
      if (res) {
        setOpenDialog(false);
        setEditData(null);
        toast.success(t('components.admin-ui.categories.categories-list.messages.update-category-success'));
      } else {
        setOpenDialog(false);
        setEditData(null);
        toast.error(t('components.admin-ui.categories.categories-list.messages.update-category-error'));
      }
    } else {
      const res = await createCategory(formData);
      if (res) {
        setOpenDialog(false);
        toast.success(t('components.admin-ui.categories.categories-list.messages.create-category-success'));
      } else {
        setOpenDialog(false);
        toast.error(t('components.admin-ui.categories.categories-list.messages.create-category-error'));
      }
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setEditData(null);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog} modal={true}>
      <DialogOverlay className="bg-black/50" />
      <DialogTrigger className="hidden" onClick={handleCancel} />
      <DialogContent className="max-w-md rounded-[18px!important]">
        <DialogHeader className="pt-4">
          <DialogTitle>{t('components.admin-ui.categories.categories-dialog.title')}</DialogTitle>
          <DialogDescription>{t('components.admin-ui.categories.categories-dialog.description')}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit} id="categories-dialog-form">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-right text-xs">
              {t('components.admin-ui.categories.categories-dialog.name-placeholder')}
            </Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder={t('components.admin-ui.categories.categories-dialog.name-placeholder')} 
              className="w-full shadow-none focus-visible:ring-1" 
              id="name"
              disabled={loading}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {t('components.admin-ui.categories.categories-dialog.cancel')}
          </Button>
          <Button variant="default" type="submit" form="categories-dialog-form" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editData ? t('components.admin-ui.categories.categories-dialog.updating') : t('components.admin-ui.categories.categories-dialog.creating')}
              </>
            ) : (
              editData ? t('components.admin-ui.categories.categories-dialog.update') : t('components.admin-ui.categories.categories-dialog.create')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesDialog;