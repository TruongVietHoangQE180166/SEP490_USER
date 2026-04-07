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
