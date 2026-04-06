import { observable } from '@legendapp/state';
import { TeacherStudentState, TeacherStudent } from './types';

const INITIAL_STATE: TeacherStudentState = {
  students: [],
  isLoading: false,
  error: null,
  totalElements: 0,
  currentPage: 1,
  pageSize: 10,
  searchQuery: '',
  filterStatus: 'ALL',
};

export const teacherStudentState$ = observable<TeacherStudentState>(INITIAL_STATE);

export const teacherStudentActions = {
  setStudents: (students: TeacherStudent[]) => {
    teacherStudentState$.students.set(students);
  },

  setLoading: (isLoading: boolean) => {
    teacherStudentState$.isLoading.set(isLoading);
  },

  setError: (error: string | null) => {
    teacherStudentState$.error.set(error);
  },

  setPagination: (data: { totalElement: number; page?: number; size?: number }) => {
    teacherStudentState$.totalElements.set(data.totalElement);
    if (data.page !== undefined) teacherStudentState$.currentPage.set(data.page);
    if (data.size !== undefined) teacherStudentState$.pageSize.set(data.size);
  },

  setCurrentPage: (page: number) => {
    teacherStudentState$.currentPage.set(page);
  },

  setFilters: (filters: { status?: string; query?: string }) => {
    if (filters.status !== undefined) teacherStudentState$.filterStatus.set(filters.status);
    if (filters.query !== undefined) teacherStudentState$.searchQuery.set(filters.query);
    teacherStudentState$.currentPage.set(1);
  },

  reset: () => {
    teacherStudentState$.set(INITIAL_STATE);
  },
};
