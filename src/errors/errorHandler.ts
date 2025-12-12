import { errorActions } from './errorStore';
import { ErrorType } from './errorTypes';
import { MESSAGES } from '@/constants/messages';

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    console.error(`Error in ${context}:`, error);

    if (error instanceof Error) {
      // Check error type
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorActions.setError(ErrorType.NETWORK, MESSAGES.ERROR.NETWORK);
      } else if (error.message.includes('auth') || error.message.includes('token')) {
        errorActions.setError(ErrorType.AUTH, error.message);
      } else if (error.message.includes('required') || error.message.includes('invalid')) {
        errorActions.setError(ErrorType.VALIDATION, error.message);
      } else {
        errorActions.setError(ErrorType.UNKNOWN, error.message);
      }
    } else {
      errorActions.setError(ErrorType.UNKNOWN, MESSAGES.ERROR.UNKNOWN);
    }
  }

  static async handleAsync<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context);
      return null;
    }
  }
}