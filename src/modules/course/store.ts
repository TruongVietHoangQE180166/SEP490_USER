import { observable } from '@legendapp/state';
import { CourseState, UserLevel, LessonNote, CourseDiscussionMessage, Question } from './types';

const initialCourseState: CourseState = {
  courses: [],
  currentCourse: null,
  currentLesson: null,
  quizQuestions: [],
  isQuizMode: false,
  currentQuizId: null,
  isLoading: false,
  error: null,
  completedLessons: [],
  userLevel: null,
  notes: [],
  discussionMessages: [],
};

export const courseState$ = observable<CourseState>(initialCourseState);

export const courseActions = {
  setCourses: (courses: CourseState['courses']) => {
    courseState$.courses.set(courses);
  },

  setCurrentCourse: (course: CourseState['currentCourse']) => {
    courseState$.currentCourse.set(course);
  },

  setCurrentLesson: (lesson: CourseState['currentLesson']) => {
    courseState$.currentLesson.set(lesson);
  },

  setQuizQuestions: (questions: Question[]) => {
    courseState$.quizQuestions.set(questions);
  },

  setQuizMode: (isQuiz: boolean, quizId: string | null = null) => {
    courseState$.isQuizMode.set(isQuiz);
    courseState$.currentQuizId.set(quizId);
  },

  setLoading: (isLoading: boolean) => {
    courseState$.isLoading.set(isLoading);
  },

  setError: (error: string | null) => {
    courseState$.error.set(error);
  },

  setCompletedLessons: (lessonIds: string[]) => {
    courseState$.completedLessons.set(lessonIds);
  },

  addCompletedLesson: (lessonId: string) => {
    const current = courseState$.completedLessons.get();
    if (!current.includes(lessonId)) {
      courseState$.completedLessons.set([...current, lessonId]);
    }
  },

  setUserLevel: (level: UserLevel | null) => {
    courseState$.userLevel.set(level);
  },

  setNotes: (notes: CourseState['notes']) => {
    courseState$.notes.set(notes);
  },

  addNote: (note: LessonNote) => {
    const current = courseState$.notes.get();
    courseState$.notes.set([note, ...current]);
  },

  updateNote: (note: LessonNote) => {
    const current = courseState$.notes.get();
    courseState$.notes.set(current.map(n => n.id === note.id ? note : n));
  },

  removeNote: (noteId: string) => {
    const current = courseState$.notes.get();
    courseState$.notes.set(current.filter(n => n.id !== noteId));
  },

  setDiscussionMessages: (messages: CourseDiscussionMessage[]) => {
    courseState$.discussionMessages.set(messages);
  },

  addDiscussionMessage: (message: CourseDiscussionMessage) => {
    // Only add if not already exists (avoid duplicates from realtime)
    const current = courseState$.discussionMessages.peek();
    if (!current.find(m => m.id === message.id)) {
      courseState$.discussionMessages.push(message);
    }
  },

  updateDiscussionMessage: (message: CourseDiscussionMessage) => {
    const current = courseState$.discussionMessages.peek();
    courseState$.discussionMessages.set(current.map(m => m.id === message.id ? message : m));
  },

  removeDiscussionMessage: (messageId: string) => {
    const current = courseState$.discussionMessages.peek();
    courseState$.discussionMessages.set(current.filter(m => m.id !== messageId));
  },

  reset: () => {
    courseState$.set(initialCourseState);
  },
};
