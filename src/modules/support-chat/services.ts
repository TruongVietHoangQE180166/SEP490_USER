import { supabase } from '@/lib/supabase';
import { SupportMessage, SendSupportMessageParams } from './types';

export const SupportChatService = {
  /**
   * Fetches the conversation history for a specific user.
   */
  getHistory: async (userId: string): Promise<SupportMessage[]> => {
    if (!supabase) {
      console.warn('Supabase is not initialized. Returning empty history.');
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }

      return data as SupportMessage[];
    } catch (err) {
      console.error('getHistory unexpected error:', err);
      return [];
    }
  },

  /**
   * Sends a message through Supabase.
   */
  sendMessage: async (params: SendSupportMessageParams) => {
    if (!supabase) {
      console.error('[SupportChat] Supabase Client is not initialized! Check your .env setup.');
      return { success: false, error: 'Supabase is not initialized.' };
    }
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .insert([{
          user_id: params.userId,
          sender_id: params.senderId,
          sender_role: params.senderRole,
          content: params.content,
          sender_name: params.senderName, // Added this
          is_read: false,
        }])
        .select()
        .single();

      if (error) {
        console.error('[SupportChat] INSERT Error:', error.message, error.details);
        throw error;
      }

      console.log('[SupportChat] Message sent successfully:', data);
      return { success: true, data };
    } catch (err: any) {
      console.error('[SupportChat] sendMessage unexpected error:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Subscribes to realtime updates for a specific conversation.
   */
  subscribeToMessages: (userId: string, onNewMessage: (msg: SupportMessage) => void) => {
    if (!supabase) {
      return { unsubscribe: () => {} };
    }
    const channel = supabase
      .channel(`support-chat-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'support_messages',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            onNewMessage(payload.new as SupportMessage);
          } else if (payload.eventType === 'UPDATE') {
            // When a message is updated (e.g., is_read becomes true), we can refresh the list
            onNewMessage(payload.new as SupportMessage);
          }
        }
      )
      .subscribe();

    return channel;
  },
  /**
   * ADMIN: Fetches a list of all unique conversations (users who have messaged).
   */
  getAllConversations: async (): Promise<{ user_id: string; last_message: string; created_at: string; sender_name?: string; unread_count: number; last_sender_role: 'user' | 'admin' | 'teacher'; client_role: 'user' | 'teacher' }[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('user_id, content, created_at, sender_name, is_read, sender_role')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[SupportChat] getAllConversations DB Error:', error.message, error.details);
        throw error;
      }

      const conversationsMap: Record<string, any> = {};
      data.forEach(item => {
        if (!conversationsMap[item.user_id]) {
          conversationsMap[item.user_id] = {
            user_id: item.user_id,
            last_message: item.content,
            created_at: item.created_at,
            sender_name: 'Khách', // Default
            last_sender_role: item.sender_role,
            unread_count: 0,
            client_role: 'user' // Default
          };
        }
        
        // Count unread messages from client roles (user or teacher)
        if (!item.is_read && (item.sender_role === 'user' || item.sender_role === 'teacher')) {
          conversationsMap[item.user_id].unread_count++;
        }

        // Determine the client identity (the one who's NOT the admin)
        // We always want to use the Client's name as the Room Title
        if (item.sender_role !== 'admin') {
          conversationsMap[item.user_id].client_role = item.sender_role;
          // Set sender_name only if it's from the client
          if (item.sender_name) {
            conversationsMap[item.user_id].sender_name = item.sender_name;
          }
        }
      });

      return Object.values(conversationsMap);
    } catch (err: any) {
      console.error('[SupportChat] getAllConversations unexpected error:', err.message || err);
      return [];
    }
  },

  /**
   * ADMIN/USER: Marks all messages in a conversation as read.
   */
  markAsRead: async (userId: string, roleToMark: 'user' | 'admin' | 'teacher') => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('sender_role', roleToMark)
        .eq('is_read', false);

      if (error) throw error;
    } catch (err) {
      console.error('markAsRead error:', err);
    }
  },

  /**
   * ADMIN: Subscribes to ALL messages (no filter).
   */
  subscribeToAllMessages: (onNewMessage: (msg: SupportMessage) => void) => {
    if (!supabase) return { unsubscribe: () => {} };
    // Use a unique channel name to avoid "callback after subscribe" errors
    const channelId = `admin-global-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, etc.
          schema: 'public',
          table: 'support_messages',
        },
        (payload) => {
          onNewMessage(payload.new as SupportMessage);
        }
      )
      .subscribe();

    return channel;
  }
};
