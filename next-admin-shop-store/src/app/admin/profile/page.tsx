import ProfileInformation from '@/components/admin-ui/profile/profile-information';
import ProfileDialog from '@/components/admin-ui/profile/profile-dialog';
import ProfileToolbar from '@/components/admin-ui/profile/profile-toolbar';
import UpdatedPassword from '@/components/admin-ui/profile/updated-password';

const ProfilePage = () => {
  return (
    <section className="flex h-full flex-col justify-between space-y-4 p-4">
      <div className="container mx-auto px-4 md:px-6">
        <ProfileToolbar />
        <ProfileInformation />
        <UpdatedPassword />
        <ProfileDialog />
      </div>
    </section>
  );
};

export default ProfilePage;
