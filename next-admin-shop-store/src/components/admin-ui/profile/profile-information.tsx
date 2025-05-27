'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { useUsersStore } from '@/stores/users.store';
import { useEffect } from 'react';
import { ProfileInformationSkeleton } from './profile-skeleton';

const ProfileInformation = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { user, loading } = useUsersStore();

  const fetchUser = useUsersStore((state) => state.getUser);

  // @ts-ignore
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">{t('components.admin-ui.profile.profile-information.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && [1, 2, 3, 4, 5].map((_, index) => <ProfileInformationSkeleton key={index} />)}
        {loading && user === null && (
          <div className="flex flex-col items-center justify-center px-10 py-20 text-center text-muted-foreground">
            <span className="text-lg font-semibold">{t('components.admin-ui.profile.profile-information.no-profile')}</span>
            <p className="mt-1 text-sm">{t('components.admin-ui.profile.profile-information.try-later')}</p>
          </div>
        )}
        {!loading && user && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                {t('components.admin-ui.profile.profile-information.full-name')}
              </div>
              <p className="rounded-md border p-2 text-sm">{user.name}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                {t('components.admin-ui.profile.profile-information.email')}
              </div>
              <p className="rounded-md border p-2 text-sm">{user.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                {t('components.admin-ui.profile.profile-information.phone')}
              </div>
              <p className="rounded-md border p-2 text-sm">{user.phone}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                {t('components.admin-ui.profile.profile-information.role')}
              </div>
              <p className="rounded-md border p-2 text-sm capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInformation;
