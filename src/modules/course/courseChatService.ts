import { supabase } from '@/lib/supabase';
import { CourseDiscussionMessage } from './types';

export const courseChatService = {
  async getMessages(courseId: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('course_discussions')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('[courseChatService] Error fetching messages:', error);
      return [];
    }
    return data as CourseDiscussionMessage[];
  },

  async sendMessage(message: Omit<CourseDiscussionMessage, 'id' | 'created_at'>) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('course_discussions')
      .insert([message])
      .select()
      .single();

    if (error) {
      console.error('[courseChatService] Error sending message:', error);
      return null;
    }
    return data as CourseDiscussionMessage;
  },

  async deleteMessage(messageId: string) {
    if (!supabase) return false;
    const { error } = await supabase.from('course_discussions').delete().eq('id', messageId);
    if (error) console.error('[courseChatService] Error deleting message:', error);
    return !error;
  },

  async editMessage(messageId: string, content: string) {
    if (!supabase) return false;
    const { error } = await supabase.from('course_discussions').update({ content }).eq('id', messageId);
    if (error) console.error('[courseChatService] Error editing message:', error);
    return !error;
  },

  async banUser(courseId: string, userId: string, bannedBy: string, hours: number | null = null, userNameStr: string = 'Unknown') {
    if (!supabase) return false;
    
    let bannedUntil = null;
    if (hours && hours > 0) {
      const date = new Date();
      date.setTime(date.getTime() + hours * 60 * 60 * 1000);
      bannedUntil = date.toISOString();
    }

    const { error } = await supabase.from('course_discussion_bans').insert([{ 
      course_id: courseId, 
      user_id: userId,
      banned_by: bannedBy,
      banned_until: bannedUntil,
      reason: userNameStr
    }]);
    if (error) {
      console.error('[courseChatService] Error banning user:', error.message || error.details || JSON.stringify(error));
    }
    return !error;
  },

  async getBannedUsers(courseId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('course_discussion_bans')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[courseChatService] Error fetching banned users:', error);
      return [];
    }
    const now = new Date();
    // Lọc ra các ban còn hiệu lực
    return data.filter(b => !b.banned_until || new Date(b.banned_until) > now);
  },

  async checkIfBanned(courseId: string, userId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('course_discussion_bans')
      .select('banned_until')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    
    // Check if ban is still active
    if (!data.banned_until) return { isBanned: true, bannedUntil: null };
    const isActive = new Date(data.banned_until) > new Date();
    return isActive ? { isBanned: true, bannedUntil: data.banned_until } : null;
  },

  async unbanUser(banId: string) {
    if (!supabase) return false;
    const { error } = await supabase.from('course_discussion_bans').delete().eq('id', banId);
    return !error;
  },

  subscribeToMessages(
    courseId: string, 
    onMessage: (message: CourseDiscussionMessage) => void,
    onUpdate?: (message: CourseDiscussionMessage) => void,
    onDelete?: (id: string) => void
  ) {
    if (!supabase) return null;

    const channel = supabase
      .channel(`course_chat_${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_discussions',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as CourseDiscussionMessage;
            if (newMsg.course_id === courseId) onMessage(newMsg);
          } else if (payload.eventType === 'UPDATE' && onUpdate) {
            const updatedMsg = payload.new as CourseDiscussionMessage;
            if (updatedMsg.course_id === courseId) onUpdate(updatedMsg);
          } else if (payload.eventType === 'DELETE' && onDelete) {
            // DELETE payloads usually only include the Primary Key (e.g., payload.old.id)
            onDelete(payload.old.id as string);
          }
        }
      )
      .subscribe();

    return channel;
  },

  subscribeToBans(
    courseId: string, 
    onBanChange: (payload: any) => void
  ) {
    if (!supabase) return null;

    const channel = supabase
      .channel(`course_bans_${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_discussion_bans',
          filter: `course_id=eq.${courseId}`,
        },
        (payload) => {
          onBanChange(payload);
        }
      )
      .subscribe();

    return channel;
  },

  unsubscribe(channel: any) {
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
  }
};
