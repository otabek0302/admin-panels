'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/stores/profile.store';
import { toast } from 'sonner';
import { useUsersStore } from '@/stores/users.store';

const ProfileDialog = () => {
  const { t } = useTranslation();
  const { user } = useUsersStore();
  const { openEditDialog, setOpenEditDialog, updateProfile } = useProfileStore();
  const fetchUser = useUsersStore((state) => state.getUser);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const { name, email, phone } = formData;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!user?.id) {
      toast.error(t('components.admin-ui.profile.messages.user-not-found'));
      return;
    }

    const success = await updateProfile(formData, user.id);

    if (success) {
      toast.success(t('components.admin-ui.profile.messages.update-profile-success'));
      fetchUser(user.id);
    } else {
      toast.error(t('components.admin-ui.profile.messages.update-profile-error'));
    }

    setTimeout(() => {
      setLoading(false);
      setOpenEditDialog(false);
    }, 1500);
  };

  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl">{t('components.admin-ui.profile.profile-dialog.title')}</DialogTitle>
        <DialogDescription>{t('components.admin-ui.profile.profile-dialog.description')}</DialogDescription>

        <form onSubmit={handleSubmit} method="dialog" className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('components.admin-ui.profile.profile-dialog.full-name')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" value={name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t('components.admin-ui.profile.profile-dialog.full-name-placeholder')} required disabled={loading} className="w-full pl-9 shadow-none focus-visible:ring-1" autoComplete="off" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('components.admin-ui.profile.profile-dialog.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t('components.admin-ui.profile.profile-dialog.email-placeholder')} required disabled={loading} className="w-full pl-9 shadow-none focus-visible:ring-1" autoComplete="off" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t('components.admin-ui.profile.profile-dialog.phone')}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="phone" type="tel" value={phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={t('components.admin-ui.profile.profile-dialog.phone-placeholder')} required disabled={loading} className="w-full pl-9 shadow-none focus-visible:ring-1" autoComplete="off" />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit" variant="outline" className="bg-primary text-white hover:bg-primary/90 dark:bg-gray-800" disabled={loading}>
              {loading ? t('components.admin-ui.profile.profile-dialog.updating') : t('components.admin-ui.profile.profile-dialog.update-profile')}
            </Button>
            <Button type="button" variant="outline" className="bg-gray-200 hover:bg-gray-100" onClick={() => setOpenEditDialog(false)} disabled={loading}>
              {t('components.admin-ui.profile.profile-dialog.cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
