'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole } from '@/interfaces/user';
import { useUsersStore } from '@/stores/users.store';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const UsersDialog = ({ setOpenDialog, openDialog }: { setOpenDialog: (open: boolean) => void; openDialog: boolean }) => {
  const { t } = useTranslation();
  const { editData, updateUser, createUser, setEditData, loading } = useUsersStore();
  
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'USER',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id,
        name: editData.name,
        email: editData.email ?? '',
        role: editData.role as UserRole,
        password: editData.password ?? '',
        phone: editData.phone ?? '+998',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'USER' as UserRole,
        password: '123456',
        phone: '+998',
      });
    }
  }, [editData, openDialog]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editData) {
      const res = await updateUser(formData);
      if (res) {
        setOpenDialog(false);
        setEditData(null);
        toast.success(t('components.admin-ui.users.users-list.messages.update-user-success'));
      } else {
        setOpenDialog(false);
        setEditData(null);
        toast.error(t('components.admin-ui.users.users-list.messages.update-user-error'));
      }
    } else {
      const res = await createUser(formData);
      if (res) {
        setOpenDialog(false);
        toast.success(t('components.admin-ui.users.users-list.messages.create-user-success'));
      } else {
        setOpenDialog(false);
        toast.error(t('components.admin-ui.users.users-list.messages.create-user-error'));
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
          <DialogTitle>{t('components.admin-ui.users.users-dialog.title')}</DialogTitle>
          <DialogDescription>{t('components.admin-ui.users.users-dialog.description')}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit} id="users-dialog-form">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-right text-xs">
              {t('components.admin-ui.users.users-dialog.name-placeholder')}
            </Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder={t('components.admin-ui.users.users-dialog.name-placeholder')} 
              className="w-full shadow-none focus-visible:ring-1" 
              id="name"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-right text-xs">
              {t('components.admin-ui.users.users-dialog.email-placeholder')}
            </Label>
            <Input 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder={t('components.admin-ui.users.users-dialog.email-placeholder')} 
              className="w-full shadow-none focus-visible:ring-1"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-right text-xs">
              {t('components.admin-ui.users.users-dialog.phone-placeholder')}
            </Label>
            <Input 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
              placeholder={t('components.admin-ui.users.users-dialog.phone-placeholder')} 
              className="w-full shadow-none focus-visible:ring-1"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-right text-xs">
              {t('components.admin-ui.users.users-dialog.password-placeholder')}
            </Label>
            <Input 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              placeholder={t('components.admin-ui.users.users-dialog.password-placeholder')} 
              className="w-full shadow-none focus-visible:ring-1"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="role" className="text-right text-xs">
              {t('components.admin-ui.users.users-dialog.role-placeholder')}
            </Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.admin-ui.users.users-dialog.role-placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">{t('components.admin-ui.users.users-dialog.role-user')}</SelectItem>
                <SelectItem value="ADMIN">{t('components.admin-ui.users.users-dialog.role-admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {t('components.admin-ui.users.users-dialog.cancel')}
          </Button>
          <Button variant="default" type="submit" form="users-dialog-form" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editData ? t('components.admin-ui.users.users-dialog.updating') : t('components.admin-ui.users.users-dialog.creating')}
              </>
            ) : (
              editData ? t('components.admin-ui.users.users-dialog.update') : t('components.admin-ui.users.users-dialog.create')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsersDialog;
