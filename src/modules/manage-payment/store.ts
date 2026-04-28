import { observable } from '@legendapp/state';
import { PaymentManagementState } from './types';

const INITIAL_STATE: PaymentManagementState = {
  payments: [],
  isLoading: false,
  error: null,
  selectedPayment: null,
  isModalOpen: false,
  modalMode: 'view',
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  filterStatus: 'ALL',
  searchQuery: '',
  totalRevenue: 0,
};

export const paymentState$ = observable<PaymentManagementState>(INITIAL_STATE);

export const paymentActions = {
  setPayments: (payments: any[]) => {
    paymentState$.payments.set(payments);
  },
  setLoading: (isLoading: boolean) => {
    paymentState$.isLoading.set(isLoading);
  },
  setPagination: (data: { totalElement: number; totalPages?: number; page?: number }) => {
    paymentState$.totalElements.set(data.totalElement);
    if (data.totalPages) paymentState$.totalPages.set(data.totalPages);
    if (data.page) paymentState$.currentPage.set(data.page);
  },
  setTotalRevenue: (revenue: number) => {
    paymentState$.totalRevenue.set(revenue);
  },
  setCurrentPage: (page: number) => {
    paymentState$.currentPage.set(page);
  },
  setFilters: (filters: { status?: string; query?: string }) => {
    if (filters.status !== undefined) paymentState$.filterStatus.set(filters.status);
    if (filters.query !== undefined) paymentState$.searchQuery.set(filters.query);
    paymentState$.currentPage.set(1);
  },
  openModal: (mode: 'view', payment: any) => {
    paymentState$.modalMode.set(mode);
    paymentState$.selectedPayment.set(payment);
    paymentState$.isModalOpen.set(true);
  },
  closeModal: () => {
    paymentState$.isModalOpen.set(false);
    paymentState$.selectedPayment.set(null);
  },
  reset: () => {
    paymentState$.set(INITIAL_STATE);
  },
};
