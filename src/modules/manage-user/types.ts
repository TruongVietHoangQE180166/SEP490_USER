export interface User {
  id: string;
  username: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  role: 'ADMIN' | 'TEACHER' | 'USER';
  gender?: 'MALE' | 'FEMALE';
  fullName?: string;
  phoneNumber?: string;
  deleted: boolean;
  password?: string;
}

export interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  selectedUser: User | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
  // Pagination
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  // Filters
  filterStatus: string;
  filterRole: string;
}

export interface CommonApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: any;
  success: boolean;
}

export interface UserApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: {
    content: User[];
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

