'use client';

import UploadProductImage from './upload-product-image';
import SelectProductCategory from './select-product-category';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useProductsStore } from '@/stores/product.store';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ProductsDialog = ({ setOpenDialog, openDialog }: { setOpenDialog: (open: boolean) => void; openDialog: boolean }) => {
  const { t } = useTranslation();
  const { editData, updateProduct, createProduct, setEditData } = useProductsStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: 0,
    stock: 0,
    categoryId: '',
    imageBase64: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        description: editData.description,
        brand: editData.brand,
        price: editData.price,
        stock: editData.stock,
        categoryId: editData.category.id,
        imageBase64: null,
      });
      setExistingImage(editData.image);
    } else {
      setFormData({
        name: '',
        description: '',
        brand: '',
        price: 0,
        stock: 0,
        categoryId: '',
        imageBase64: null,
      });
      setImageFile(null);
      setExistingImage(null);
    }
    setError(null);
  }, [editData, openDialog]);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.brand || !formData.categoryId || formData.price <= 0 || formData.stock < 0) {
      setError(t('components.admin-ui.products.messages.missing-fields'));
      return;
    }

    if (!imageFile && !existingImage) {
      setError(t('components.admin-ui.products.messages.image-required'));
      return;
    }

    try {
      const imageBase64 = imageFile ? await convertToBase64(imageFile) : null;

      const payload = {
        ...formData,
        imageBase64,
      };

      let success = false;

      if (editData) {
        success = await updateProduct({ ...editData, ...formData, imageBase64: imageBase64 || undefined });
        setEditData(null);
        toast[success ? 'success' : 'error'](t(`components.admin-ui.products.messages.${success ? 'update-product-success' : 'update-product-error'}`));
      } else {
        success = await createProduct(payload as any);
        toast[success ? 'success' : 'error'](t(`components.admin-ui.products.messages.${success ? 'create-product-success' : 'create-product-error'}`));
      }

      if (success) setOpenDialog(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(t('components.admin-ui.products.messages.error'));
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
      <DialogContent className="no-scrollbar h-[95vh] w-[95vw] max-w-md overflow-y-auto rounded-[18px!important]">
        <DialogHeader className="pt-4">
          <DialogTitle>{editData ? t('components.admin-ui.products.products-dialog.edit-title') : t('components.admin-ui.products.products-dialog.add-title')}</DialogTitle>
          <DialogDescription>{t('components.admin-ui.products.products-dialog.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4" id="products-dialog-form">
          {error && <div className="rounded bg-red-100 px-4 py-2 text-sm text-red-600">{error}</div>}

          <UploadProductImage image={imageFile} setImage={setImageFile} existingImage={existingImage} clearExistingImage={() => setExistingImage(null)} />

          <Label htmlFor="name">{t('components.admin-ui.products.products-dialog.name-label')}</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

          <Label htmlFor="description">{t('components.admin-ui.products.products-dialog.description-label')}</Label>
          <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

          <Label htmlFor="brand">{t('components.admin-ui.products.products-dialog.brand-label')}</Label>
          <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />

          <Label htmlFor="price">{t('components.admin-ui.products.products-dialog.price-label')}</Label>
          <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: +e.target.value })} required />

          <Label htmlFor="stock">{t('components.admin-ui.products.products-dialog.stock-label')}</Label>
          <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: +e.target.value })} required />

          <SelectProductCategory category={formData.categoryId} setCategory={(catId) => setFormData({ ...formData, categoryId: catId })} />

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t('components.admin-ui.products.products-dialog.cancel')}
            </Button>
            <Button type="submit" form="products-dialog-form">
              {editData ? t('components.admin-ui.products.products-dialog.update') : t('components.admin-ui.products.products-dialog.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductsDialog;