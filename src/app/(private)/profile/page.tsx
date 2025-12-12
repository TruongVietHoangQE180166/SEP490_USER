'use client';

import { observer } from '@legendapp/state/react';
import { withAuthGuard } from '@/guards/authGuard';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { ProfileCard } from '@/modules/profile/components/ProfileCard';

const ProfilePageContent = observer(() => {
  const { profile, isLoading, isEditing, updateProfile, toggleEdit } = useProfile();

  if (isLoading && !profile) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Không tìm thấy thông tin</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hồ sơ cá nhân</h1>
      <ProfileCard
        profile={profile}
        isEditing={isEditing}
        onToggleEdit={toggleEdit}
        onUpdate={updateProfile}
      />
    </div>
  );
});

export default withAuthGuard(ProfilePageContent);