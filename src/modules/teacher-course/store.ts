import { observable } from '@legendapp/state';
import { TeacherCourse, TeacherCourseState } from './types';

const INITIAL_STATE: TeacherCourseState = {
  courses: [],
  isLoading: false,
  error: null,
  selectedCourse: null,
  isModalOpen: false,
  modalMode: 'create',
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 12,
  filterStatus: 'ALL',
  searchQuery: '',
  isDeleting: false,
  isUploadingVideo: false,
};

export const teacherCourseState$ = observable<TeacherCourseState>(INITIAL_STATE);

export const teacherCourseActions = {
  setCourses: (courses: TeacherCourse[]) => {
    teacherCourseState$.courses.set(courses);
  },

  setLoading: (isLoading: boolean) => {
    teacherCourseState$.isLoading.set(isLoading);
  },

  setError: (error: string | null) => {
    teacherCourseState$.error.set(error);
  },

  setPagination: (data: { totalElement: number; totalPages?: number; page?: number }) => {
    teacherCourseState$.totalElements.set(data.totalElement);
    if (data.totalPages !== undefined) teacherCourseState$.totalPages.set(data.totalPages);
    if (data.page !== undefined) teacherCourseState$.currentPage.set(data.page);
  },

  setCurrentPage: (page: number) => {
    teacherCourseState$.currentPage.set(page);
  },

  setFilters: (filters: { status?: string; query?: string }) => {
    if (filters.status !== undefined) teacherCourseState$.filterStatus.set(filters.status);
    if (filters.query !== undefined) teacherCourseState$.searchQuery.set(filters.query);
    teacherCourseState$.currentPage.set(1);
  },

  setSelectedCourse: (course: TeacherCourse | null) => {
    teacherCourseState$.selectedCourse.set(course);
  },

  openModal: (mode: 'create' | 'edit' | 'view', course: TeacherCourse | null = null) => {
    teacherCourseState$.modalMode.set(mode);
    teacherCourseState$.selectedCourse.set(course);
    teacherCourseState$.isModalOpen.set(true);
  },

  closeModal: () => {
    teacherCourseState$.isModalOpen.set(false);
    teacherCourseState$.selectedCourse.set(null);
  },

  removeCourseFromList: (courseId: string) => {
    const courses = teacherCourseState$.courses.get();
    teacherCourseState$.courses.set(courses.filter((c) => c.id !== courseId));
  },

  setDeleting: (isDeleting: boolean) => {
    teacherCourseState$.isDeleting.set(isDeleting);
  },

  setUploadingVideo: (isUploadingVideo: boolean) => {
    teacherCourseState$.isUploadingVideo.set(isUploadingVideo);
  },

  /**
   * Cập nhật videoPreview của một course trong danh sách và selectedCourse (nếu đang chọn).
   * Gọi sau khi upload video preview thành công để phản ánh ngay trên UI.
   */
  updateCourseVideoPreview: (courseId: string, videoUrl: string) => {
    const courses = teacherCourseState$.courses.get();
    teacherCourseState$.courses.set(
      courses.map((c) => (c.id === courseId ? { ...c, videoPreview: videoUrl } : c))
    );
    const selected = teacherCourseState$.selectedCourse.get();
    if (selected && selected.id === courseId) {
      teacherCourseState$.selectedCourse.set({ ...selected, videoPreview: videoUrl });
    }
  },

  reset: () => {
    teacherCourseState$.set(INITIAL_STATE);
  },
};
