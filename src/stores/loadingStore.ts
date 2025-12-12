import { observable } from '@legendapp/state';

export interface LoadingState {
  isLoading: boolean;
  message: string;
  type: 'fetch' | 'update' | 'delete' | 'create' | null;
  isPageTransitioning: boolean; // Flag to prevent overlay during page transitions
}

const initialLoadingState: LoadingState = {
  isLoading: false,
  message: '',
  type: null,
  isPageTransitioning: false,
};

// Create observable
export const loadingState$ = observable<LoadingState>(initialLoadingState);

// Actions
export const loadingActions = {
  showLoading: (message: string = 'Đang tải...', type: LoadingState['type'] = 'fetch') => {
    loadingState$.set({
      isLoading: true,
      message,
      type,
      isPageTransitioning: loadingState$.isPageTransitioning.peek(), // Preserve page transition state
    });
  },

  hideLoading: () => {
    loadingState$.set({
      ...initialLoadingState,
      isPageTransitioning: loadingState$.isPageTransitioning.peek(), // Preserve page transition state
    });
  },

  setPageTransitioning: (isTransitioning: boolean) => {
    loadingState$.isPageTransitioning.set(isTransitioning);
  },

  // Convenience methods for specific types
  showFetchLoading: (message: string = 'Đang tải dữ liệu...') => {
    loadingActions.showLoading(message, 'fetch');
  },

  showUpdateLoading: (message: string = 'Đang cập nhật...') => {
    loadingActions.showLoading(message, 'update');
  },

  showCreateLoading: (message: string = 'Đang tạo mới...') => {
    loadingActions.showLoading(message, 'create');
  },

  showDeleteLoading: (message: string = 'Đang xóa...') => {
    loadingActions.showLoading(message, 'delete');
  },
};
