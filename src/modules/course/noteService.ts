import { supabase } from '@/lib/supabase';
import { LessonNote } from './types';

export const noteService = {
  async getNotes(lessonId: string, userId: string): Promise<LessonNote[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('lesson_notes')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[noteService] Error fetching notes:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      lesson_id: item.lesson_id,
      user_id: item.user_id,
      content: item.content,
      created_date: item.created_at,
      updated_date: item.updated_at
    }));
  },

  async createNote(lessonId: string, userId: string, content: string): Promise<LessonNote | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('lesson_notes')
      .insert([
        {
          lesson_id: lessonId,
          user_id: userId,
          content: content,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[noteService] Error creating note:', error);
      return null;
    }

    return {
      id: data.id,
      lesson_id: data.lesson_id,
      user_id: data.user_id,
      content: data.content,
      created_date: data.created_at,
      updated_date: data.updated_at
    };
  },

  async updateNote(noteId: string, content: string): Promise<LessonNote | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('lesson_notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('[noteService] Error updating note:', error);
      return null;
    }

    return {
      id: data.id,
      lesson_id: data.lesson_id,
      user_id: data.user_id,
      content: data.content,
      created_date: data.created_at,
      updated_date: data.updated_at
    };
  },

  async deleteNote(noteId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
      .from('lesson_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('[noteService] Error deleting note:', error);
      return false;
    }

    return true;
  },
};
