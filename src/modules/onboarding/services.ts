import { supabase } from '@/lib/supabase';
import { ApiConfigService } from '@/services/apiConfig';

export interface WalletAddBalanceResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: Array<{
    field: string;
    message: string;
  }>;
  data: {
    id: string;
    userId: string;
    username: string;
    email: string;
    avatar: string;
    currency: string;
    availableBalance: number;
    lockedBalance: number;
    margin: number;
    createdDate: string;
  };
  success: boolean;
}

export const onboardingService = {
  /**
   * Kiểm tra xem người dùng đã xem onboarding chưa, và đã nhận thưởng chưa
   */
  checkOnboardingStatus: async (userId: string) => {
    if (!supabase) return { hasSeen: false, hasClaimed: false };
    
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('has_seen, has_claimed_reward')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching onboarding status:', error);
      }
      
      return { 
        hasSeen: !!data?.has_seen,
        hasClaimed: !!data?.has_claimed_reward
      };
    } catch (e) {
      console.error('Failed to check onboarding:', e);
      return { hasSeen: false, hasClaimed: false };
    }
  },
  
  /**
   * Đánh dấu người dùng đã xem/skip onboarding
   */
  markAsSeen: async (userId: string, role?: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .upsert(
          { 
            user_id: userId, 
            role: role || 'USER', 
            has_seen: true, 
            updated_at: new Date().toISOString() 
          },
          { onConflict: 'user_id' }
        );
        
      if (error) {
        console.error('Error marking onboarding as seen:', error);
      }
    } catch (e) {
      console.error('Failed to update onboarding status:', e);
    }
  },

  /**
   * Đánh dấu người dùng đã nhận phần thưởng tân thủ
   */
  markRewardAsClaimed: async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .update({ 
          has_claimed_reward: true,
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error marking reward as claimed:', error);
      }
    } catch (e) {
      console.error('Failed to update reward status:', e);
    }
  },

  /**
   * Gọi API nhận thưởng
   */
  claimNewbieReward: async (userId: string, amount: number = 100000): Promise<WalletAddBalanceResponse> => {
    const endpoint = `/api/v1/wallets/add-balance?userId=${userId}&amount=${amount}`;
    return ApiConfigService.post<WalletAddBalanceResponse>(endpoint);
  }
};
