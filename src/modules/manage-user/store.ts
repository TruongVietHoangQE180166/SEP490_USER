import { observable } from '@legendapp/state';
import { User, UserState } from './types';

const initialUserState: UserState = {
  users: [],
  isLoading: false,
  error: null,
  selectedUser: null,
  isModalOpen: false,
  modalMode: 'view',
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  filterStatus: 'ALL',
  filterRole: 'ALL',
};

export const userState$ = observable<UserState>(initialUserState);

export const userActions = {
  setUsers: (users: User[]) => {
    userState$.users.set(users);
  },
  setPagination: (data: { totalElement: number, totalPages?: number, page?: number }) => {
    userState$.totalElements.set(data.totalElement);
    if (data.totalPages) userState$.totalPages.set(data.totalPages);
    if (data.page) userState$.currentPage.set(data.page);
  },
  setCurrentPage: (page: number) => {
    userState$.currentPage.set(page);
  },
  setFilters: (filters: { status?: string, role?: string }) => {
    if (filters.status !== undefined) userState$.filterStatus.set(filters.status);
    if (filters.role !== undefined) userState$.filterRole.set(filters.role);
    userState$.currentPage.set(1); // Reset to first page on filter change
  },
  setLoading: (isLoading: boolean) => {
    userState$.isLoading.set(isLoading);
  },
  setError: (error: string | null) => {
    userState$.error.set(error);
  },
  setSelectedUser: (user: User | null) => {
    userState$.selectedUser.set(user);
  },
  openModal: (mode: 'create' | 'edit' | 'view', user: User | null = null) => {
    userState$.modalMode.set(mode);
    userState$.selectedUser.set(user);
    userState$.isModalOpen.set(true);
  },
  closeModal: () => {
    userState$.isModalOpen.set(false);
    userState$.selectedUser.set(null);
  },
  updateUserInList: (userId: string, updates: Partial<User>) => {
    const users = userState$.users.get();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      userState$.users[index].assign(updates);
    }
  },
  reset: () => {
    userState$.set(initialUserState);
  }
};

