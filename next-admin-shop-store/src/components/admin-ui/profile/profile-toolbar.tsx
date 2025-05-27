'use client';

import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/stores/profile.store';
import { useTranslation } from 'react-i18next';

const ProfileToolbar = () => {
  const { t } = useTranslation();
  const { setOpenEditDialog } = useProfileStore();

  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-2xl font-bold tracking-tight">{t('components.admin-ui.profile.profile-toolbar.title')}</h3>
      <Button variant="outline" className="cursor-pointer bg-primary text-white hover:bg-primary/90 hover:text-white" onClick={() => setOpenEditDialog(true)}>
        {t('components.admin-ui.profile.profile-toolbar.edit-profile')}
      </Button>
    </div>
  );
};

export default ProfileToolbar;
