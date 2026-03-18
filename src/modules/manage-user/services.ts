import { ApiConfigService } from '@/services/apiConfig';
import { User, UserApiResponse } from './types';

export const userService = {
  async getUsers(
    page = 1, 
    size = 10, 
    field = 'createdDate', 
    direction = 'desc',
    status?: string,
    role?: string
  ): Promise<UserApiResponse> {
    let url = `/api/user?page=${page}&size=${size}&field=${field}&direction=${direction}`;
    if (status && status !== 'ALL') url += `&status=${status}`;
    if (role && role !== 'ALL') url += `&role=${role}`;

    const response = await ApiConfigService.get<UserApiResponse>(url);

    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to fetch users');
    }

    return response;
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const { username, email, password, role, gender, fullName, phoneNumber } = userData;
    
    // Construct query parameters as requested
    const queryParams = new URLSearchParams({
      userName: username || '',
      email: email || '',
      password: password || '',
      role: role || 'USER',
      gender: gender || 'MALE',
      fullName: fullName || '',
      phoneNumber: phoneNumber || ''
    });

    const response = await ApiConfigService.post<any>(`/api/user/create-user?${queryParams.toString()}`, {});
    
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to create user');
    }
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await ApiConfigService.put<any>(`/api/user/${id}`, userData);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message?.messageDetail || 'Failed to update user');
    }
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    const response = await ApiConfigService.delete<any>(`/api/user/${id}`);
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Failed to delete user');
    }
  },

  async updateUserStatus(userId: string, status: string): Promise<void> {
    const response = await ApiConfigService.put<any>(`/api/user/status/${userId}?status=${status}`, {});
    if (!response || !response.success) {
      throw new Error(response?.message?.messageDetail || 'Failed to update user status');
    }
  }
};

