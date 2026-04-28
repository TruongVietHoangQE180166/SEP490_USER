export interface Payment {
  id: string;
  amount: number;
  courseId: string;
  courseTitle: string;
  thumbnailUrl: string;
  voucherCode: string | null;
  discountValue: number | null;
  status: 'COMPLETED' | 'CANCELLED' | 'PENDING';
  qrCode: string;
  createdDate: string;
}

export interface PaymentManagementState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  selectedPayment: Payment | null;
  isModalOpen: boolean;
  modalMode: 'view';
  // Pagination
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  // Filters
  filterStatus: string;
  searchQuery: string;
  // Revenue
  totalRevenue: number;
}

export interface PaymentApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: {
    content: Payment[];
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
