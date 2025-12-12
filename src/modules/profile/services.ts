import { MockApiService } from '@/services/mockApi';
import { MOCK_PROFILES } from './mocks';
import { UserProfile } from './types';

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await MockApiService.execute(() => {
      const profile = MOCK_PROFILES[userId];
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    });

    if (!response.success) {
      throw new Error(response.error);
    }

    return response.data!;
  },

  async updateProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    const response = await MockApiService.execute(() => {
      const profile = MOCK_PROFILES[userId];
      if (!profile) {
        throw new Error('Profile not found');
      }

      Object.assign(profile, data);
      return profile;
    });

    if (!response.success) {
      throw new Error(response.error);
    }

    return response.data!;
  },
};