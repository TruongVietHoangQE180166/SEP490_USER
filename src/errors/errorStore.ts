import { observable } from '@legendapp/state';
import { AppError, ErrorType } from './errorTypes';

interface ErrorState {
  currentError: AppError | null;
  errorHistory: AppError[];
}

const initialErrorState: ErrorState = {
  currentError: null,
  errorHistory: [],
};

export const errorState$ = observable<ErrorState>(initialErrorState);

// Actions
export const errorActions = {
  setError: (type: ErrorType, message: string) => {
    const error: AppError = {
      type,
      message,
      timestamp: Date.now(),
    };

    errorState$.currentError.set(error);
    errorState$.errorHistory.push(error);
  },

  clearError: () => {
    errorState$.currentError.set(null);
  },

  clearHistory: () => {
    errorState$.errorHistory.set([]);
  },
};