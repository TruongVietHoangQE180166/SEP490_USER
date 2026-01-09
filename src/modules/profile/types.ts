export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  address?: string;
  joinedAt: string;
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isEditing: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}