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
      console.error('[NoteService] Error fetching notes:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      lessonId: item.lesson_id,
      userId: item.user_id,
      content: item.content,
      createdDate: item.created_at,
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
      console.error('[NoteService] Error creating note:', error);
      return null;
    }

    return {
      id: data.id,
      lessonId: data.lesson_id,
      userId: data.user_id,
      content: data.content,
      createdDate: data.created_at,
    };
  },

  async deleteNote(noteId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
      .from('lesson_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('[NoteService] Error deleting note:', error);
      return false;
    }

    return true;
  },

  async updateNote(noteId: string, content: string): Promise<LessonNote | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('lesson_notes')
      .update({ content })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('[NoteService] Error updating note:', error);
      return null;
    }

    return {
      id: data.id,
      lessonId: data.lesson_id,
      userId: data.user_id,
      content: data.content,
      createdDate: data.created_at,
    };
  }
};
