import { useEffect, useState } from 'react';
import { useSelector } from '@legendapp/state/react';
import { noteService } from '../noteService';
import { courseActions, courseState$ } from '../store';
import { courseService } from '../services';

export const useLessonNotes = (lessonId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const notes = useSelector(() => courseState$.notes.get());
  
  const fetchNotes = async () => {
    if (!lessonId) return;
    
    setIsLoading(true);
    // Clear old notes immediately or when lessonId changes
    courseActions.setNotes([]);
    
    try {
      const user = await courseService.getMe();
      if (user) {
        const data = await noteService.getNotes(lessonId, user.id);
        courseActions.setNotes(data);
      }
    } catch (error) {
      console.error('[useLessonNotes] Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    
    // Cleanup: clear notes when component unmounts or lessonId changes
    return () => {
      courseActions.setNotes([]);
    };
  }, [lessonId]);

  const addNote = async (content: string) => {
    if (!lessonId || !content.trim()) return null;

    try {
      const user = await courseService.getMe();
      if (!user) return null;

      const newNote = await noteService.createNote(lessonId, user.id, content);
      if (newNote) {
        courseActions.addNote(newNote);
        return newNote;
      }
    } catch (error) {
      console.error('[useLessonNotes] Error adding note:', error);
    }
    return null;
  };

  const deleteNote = async (noteId: string) => {
    try {
      const success = await noteService.deleteNote(noteId);
      if (success) {
        courseActions.removeNote(noteId);
        return true;
      }
    } catch (error) {
      console.error('[useLessonNotes] Error deleting note:', error);
    }
    return false;
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      const updatedNote = await noteService.updateNote(noteId, content);
      if (updatedNote) {
        courseActions.updateNote(updatedNote);
        return updatedNote;
      }
    } catch (error) {
      console.error('[useLessonNotes] Error updating note:', error);
    }
    return null;
  };

  return {
    notes,
    isLoading,
    addNote,
    deleteNote,
    updateNote,
    refresh: fetchNotes
  };
};
