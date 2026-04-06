export interface TeacherStudent {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  deleted: boolean;
  password?: string; // Tồn tại trong API nhưng có thể không cần thiết frontend
}

export interface TeacherStudentApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: {
    content: TeacherStudent[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

export interface TeacherStudentState {
  students: TeacherStudent[];
  isLoading: boolean;
  error: string | null;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  filterStatus: string;
}
