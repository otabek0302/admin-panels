'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useModalStore } from '@/store/modal-store';
import { useCategoryStore } from '@/store/category-store';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const CategoryModal = () => {
  const { open, setOpen } = useModalStore();
  const { editData, createCategory, editCategory, setEditData, loading } = useCategoryStore();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setName(editData.name);
    } else {
      setName('');
    }
    setError('');
  }, [editData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(t('components.admin-ui.category.category-modal.errors.name-required'));
      return;
    }

    try {
      if (editData) {
        await editCategory(editData.id, name);
        toast.success(t('messages.success.category.category-updated'));
      } else {
        await createCategory(name);
        toast.success(t('messages.success.category.category-created'));
      }
      setOpen(false);
      setEditData(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('messages.error.category.category-operation-failed');
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="shadow-none sm:max-w-[425px]">
        <DialogTitle>{editData ? t('components.admin-ui.category.category-modal.edit-title') : t('components.admin-ui.category.category-modal.add-title')}</DialogTitle>
        <DialogDescription>{editData ? t('components.admin-ui.category.category-modal.edit-description') : t('components.admin-ui.category.category-modal.add-description')}</DialogDescription>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder={t('components.admin-ui.category.category-modal.name-placeholder')} 
              required 
              className={`w-full shadow-none focus-visible:ring-1 ${error ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="cursor-pointer bg-gray-200 hover:bg-gray-100" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t('components.admin-ui.category.category-modal.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="outline" 
              className="bg-primary hover:bg-primary/90 cursor-pointer text-white hover:text-white dark:bg-gray-800 dark:text-white"
              disabled={loading}
            >
              {loading ? t('common.loading') : editData ? t('components.admin-ui.category.category-modal.update') : t('components.admin-ui.category.category-modal.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
