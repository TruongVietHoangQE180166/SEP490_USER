'use client';

import { observer } from '@legendapp/state/react';
import { withAuthGuard } from '@/guards/authGuard';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { useChangePassword } from '@/modules/profile/hooks/useChangePassword';
import { ProfileCard } from '@/modules/profile/components/ProfileCard';
import { UserLevelCard } from '@/modules/profile/components/UserLevelCard';
import { ChangePasswordCard } from '@/modules/profile/components/ChangePasswordCard';
import { useProgress } from '@/modules/profile/hooks/useProgress';

import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton = () => (
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
    {/* UserLevelCard Skeleton */}
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>

    {/* ProfileCard Skeleton */}
    <div className="rounded-xl border bg-card p-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Skeleton className="h-32 w-32 rounded-full mx-auto md:mx-0" />
        <div className="flex-grow space-y-4 w-full">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ChangePasswordCard Skeleton */}
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  </div>
);

const ProfilePageContent = observer(() => {
  const { profile, isLoading, isEditing, updateProfile, toggleEdit } = useProfile();
  const { progress, isLoading: isProgressLoading } = useProgress();
  const { changePassword, isLoading: isChangingPassword } = useChangePassword();

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <div className="text-center py-8">Không tìm thấy thông tin</div>;
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {progress && (
        <UserLevelCard progress={progress} />
      )}
      
      <ProfileCard
        profile={profile}
        isEditing={isEditing}
        onToggleEdit={toggleEdit}
        onUpdate={updateProfile}
      />
      
      <ChangePasswordCard 
        onPasswordChange={changePassword}
        isLoading={isChangingPassword}
      />
    </div>
  );
});

export default withAuthGuard(ProfilePageContent);