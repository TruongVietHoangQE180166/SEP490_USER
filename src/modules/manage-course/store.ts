import { observable } from '@legendapp/state';
import { AdminCourse, ManageCourseState } from './types';

const INITIAL_STATE: ManageCourseState = {
  courses: [],
  isLoading: false,
  error: null,
  selectedCourse: null,
  isModalOpen: false,
  modalMode: 'view',
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 12, // Card grid — 12 looks better per page
  filterStatus: 'ALL',
  searchQuery: '',
  isStatusUpdating: false,
};

export const manageCourseState$ = observable<ManageCourseState>(INITIAL_STATE);

export const manageCourseActions = {
  setCourses: (courses: AdminCourse[]) => {
    manageCourseState$.courses.set(courses);
  },

  setLoading: (isLoading: boolean) => {
    manageCourseState$.isLoading.set(isLoading);
  },

  setError: (error: string | null) => {
    manageCourseState$.error.set(error);
  },

  setPagination: (data: { totalElement: number; totalPages?: number; page?: number }) => {
    manageCourseState$.totalElements.set(data.totalElement);
    if (data.totalPages !== undefined) manageCourseState$.totalPages.set(data.totalPages);
    if (data.page !== undefined) manageCourseState$.currentPage.set(data.page);
  },

  setCurrentPage: (page: number) => {
    manageCourseState$.currentPage.set(page);
  },

  setFilters: (filters: { status?: string; query?: string }) => {
    if (filters.status !== undefined) manageCourseState$.filterStatus.set(filters.status);
    if (filters.query !== undefined) manageCourseState$.searchQuery.set(filters.query);
    manageCourseState$.currentPage.set(1);
  },

  setSelectedCourse: (course: AdminCourse | null) => {
    manageCourseState$.selectedCourse.set(course);
  },

  openModal: (mode: 'create' | 'edit' | 'view', course: AdminCourse | null = null) => {
    manageCourseState$.modalMode.set(mode);
    manageCourseState$.selectedCourse.set(course);
    manageCourseState$.isModalOpen.set(true);
  },

  closeModal: () => {
    manageCourseState$.isModalOpen.set(false);
    manageCourseState$.selectedCourse.set(null);
  },

  updateCourseInList: (courseId: string, updates: Partial<AdminCourse>) => {
    const courses = manageCourseState$.courses.get();
    const index = courses.findIndex((c) => c.id === courseId);
    if (index !== -1) {
      manageCourseState$.courses[index].assign(updates);
    }
  },

  removeCourseFromList: (courseId: string) => {
    const courses = manageCourseState$.courses.get();
    manageCourseState$.courses.set(courses.filter((c) => c.id !== courseId));
  },

  setStatusUpdating: (isUpdating: boolean) => {
    manageCourseState$.isStatusUpdating.set(isUpdating);
  },

  reset: () => {
    manageCourseState$.set(INITIAL_STATE);
  },
};
