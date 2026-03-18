'use client';

import { observer } from '@legendapp/state/react';
import { withAuthGuard } from '@/guards/authGuard';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { useChangePassword } from '@/modules/profile/hooks/useChangePassword';
import { ProfileCard } from '@/modules/profile/components/ProfileCard';
import { ChangePasswordCard } from '@/modules/profile/components/ChangePasswordCard';

const ProfilePageContent = observer(() => {
  const { profile, isLoading, isEditing, updateProfile, toggleEdit } = useProfile();
  const { changePassword, isLoading: isChangingPassword } = useChangePassword();

  if (isLoading && !profile) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Không tìm thấy thông tin</div>;
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileCard
        profile={profile}
        isEditing={isEditing}
        onToggleEdit={toggleEdit}
        onUpdate={updateProfile}
      />
      <div className="mt-8">
        <ChangePasswordCard 
          onPasswordChange={changePassword}
          isLoading={isChangingPassword}
        />
      </div>
    </div>
  );
});

export default withAuthGuard(ProfilePageContent);