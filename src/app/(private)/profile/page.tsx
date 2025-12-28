'use client';

import { observer } from '@legendapp/state/react';
import { withAuthGuard } from '@/guards/authGuard';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { useChangePassword } from '@/modules/profile/hooks/useChangePassword';
import { ProfileCard } from '@/modules/profile/components/ProfileCard';
import { ChangePasswordCard } from '@/modules/profile/components/ChangePasswordCard';

const ProfilePageContent = observer(() => {
  const { profile, isLoading, isEditing, updateProfile, toggleEdit } = useProfile();
  const { changePassword, isLoading: isChangingPassword, error, success } = useChangePassword();

  if (isLoading && !profile) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Không tìm thấy thông tin</div>;
  }

  return (
    <div>
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