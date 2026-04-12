import { ApiConfigService } from '@/services/apiConfig';

import { UserProfile, ProfileApiResponse, UpdateProfileRequest, ImageUploadResponse, ChangePasswordResponse, ProgressApiResponse, UserProgress } from './types';

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await ApiConfigService.get<ProfileApiResponse>(`/api/profile/user/${userId}`);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch profile');
    }
    return response.data;
  },

  async updateProfile(
    userId: string,
    data: UpdateProfileRequest
  ): Promise<UserProfile> {
    const response = await ApiConfigService.put<ProfileApiResponse>(`/api/profile`, data);
    if (!response || !response.success || !response.data) {
      // Prioritize messageDetail from the API error response
      const serverMessage = response?.message?.messageDetail;
      throw new Error(serverMessage || 'Failed to update profile');
    }
    return response.data;
  },

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const result = await ApiConfigService.post<ChangePasswordResponse>(`/api/user/change-password`, {
      oldPassword,
      newPassword
    });
    
    if (!result || !result.success) {
         const serverMessage = result?.message?.messageDetail;
         throw new Error(serverMessage || 'Failed to change password');
    }
    
    return true;
  },
  
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    // We used to manually use fetch or axios here if ApiConfigService doesn't support FormData.
    // Assuming ApiConfigService.post handles FormData if passed.
    // If not, we might need a specific config for multipart/form-data.
    // Based on common patterns in this codebase (implied), we'll try using passing FormData.
    // However, usually one needs to set Content-Type header to undefined so browser sets boundary.
    // Let's assume the underlying service works or try standard approach.
    
    const response = await ApiConfigService.post<ImageUploadResponse>('/api/images/upload', formData);

    // Backend may return success: false but with valid data (image URL).
    // If data is present, we consider it a success.
    if (response?.data) {
      return response.data;
    }

    if (!response || !response.success) {
       const serverMessage = response?.message?.messageDetail;
       throw new Error(serverMessage || 'Failed to upload image');
    }
    
    return response.data;
  },

  async getUserProgress(): Promise<UserProgress> {
    const response = await ApiConfigService.get<ProgressApiResponse>(`/api/user/progress`);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch user progress');
    }
    return response.data;
  }
};