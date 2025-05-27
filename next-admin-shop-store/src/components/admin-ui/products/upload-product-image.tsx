'use client';

import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

const UploadProductImage = ({ image, setImage, existingImage, clearExistingImage }: { image: File | null; setImage: (image: File | null) => void; existingImage: { url: string } | null; clearExistingImage?: () => void }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const triggerBrowse = () => fileInputRef.current?.click();

  const removeImage = () => {
    setImage(null);
    if (clearExistingImage) clearExistingImage(); // Notify dialog to clear existing image
  };

  return (
    <div>
      <Label className="mb-2 font-medium">{t('components.admin-ui.products.products-dialog.image-label')}</Label>
      <div className="relative flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed bg-muted p-6 text-center transition hover:bg-muted/60">
        {image ? (
          <>
            <div className="relative h-48 w-48 overflow-hidden rounded-md shadow-md">
              <Image src={URL.createObjectURL(image)} alt="Selected" fill priority className="rounded-md object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <button type="button" onClick={removeImage} className="absolute right-2 top-2 rounded-full bg-white/80 p-1 hover:bg-white">
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{image.name}</p>
          </>
        ) : existingImage ? (
          <>
            <div className="relative h-48 w-48 overflow-hidden rounded-md shadow-md">
              <Image src={existingImage.url} alt="Existing" fill className="rounded-md object-cover" />
              <button type="button" onClick={removeImage} className="absolute right-2 top-2 rounded-full bg-white/80 p-1 hover:bg-white">
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{t('components.admin-ui.products.products-dialog.image-current-image')}</p>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-blue-800" />
            <p className="text-gray-600 dark:text-muted-foreground">{t('components.admin-ui.products.products-dialog.image-placeholder')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-200">{t('components.admin-ui.products.products-dialog.image-max-size-description')}</p>
            <Button type="button" variant="outline" onClick={triggerBrowse} className="cursor-pointer border-blue-800 text-blue-800 dark:bg-gray-800 dark:text-white">
              {t('components.admin-ui.products.products-dialog.image-browse-files')}
            </Button>
          </>
        )}

        <Input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
};

export default UploadProductImage;