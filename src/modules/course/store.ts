import { observable } from '@legendapp/state';
import { CourseState, UserLevel } from './types';

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

  setQuizQuestions: (questions: CourseState['quizQuestions']) => {
    courseState$.quizQuestions.set(questions);
  },

  setQuizMode: (isQuizMode: boolean, quizId: string | null = null) => {
    courseState$.isQuizMode.set(isQuizMode);
    courseState$.currentQuizId.set(quizId);
  },

  setLoading: (isLoading: boolean) => {
    courseState$.isLoading.set(isLoading);
  },

  setError: (error: string | null) => {
    courseState$.error.set(error);
  },

  markLessonCompleted: (lessonId: string) => {
    const current = courseState$.completedLessons.get();
    if (!current.includes(lessonId)) {
      courseState$.completedLessons.set([...current, lessonId]);
    }
  },

  setCompletedLessons: (lessonIds: string[]) => {
    courseState$.completedLessons.set(lessonIds);
  },

  setUserLevel: (level: UserLevel | null) => {
    courseState$.userLevel.set(level);
  },

  reset: () => {
    courseState$.set(initialCourseState);
  }
};
