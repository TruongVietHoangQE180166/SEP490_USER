export interface SupportMessage {
  id: string;
  user_id: string;
  sender_id: string;
  sender_role: 'user' | 'admin' | 'teacher';
  content: string;
  is_read: boolean;
  sender_name?: string; // Added this
  created_at: string;
}

export interface SendSupportMessageParams {
  userId: string;
  senderId: string;
  senderRole: 'user' | 'admin' | 'teacher';
  content: string;
  senderName?: string; // Added this
}

export interface AttendanceRecord {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  attendanceDate: string;
  rewardAmount: number;
}

export interface AttendanceHistoryResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: AttendanceRecord[];
  success: boolean;
}

export interface CheckInResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: { field: string; message: string }[] | null;
  data: string;
  success: boolean;
}

// Reward points per day type
export const REWARD_NORMAL_DAY = 20;   // Mon–Fri
export const REWARD_WEEKEND_DAY = 50;  // Sat–Sun
