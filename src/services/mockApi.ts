import { delay } from '@/utils/delay';
import { ApiResponse } from '@/types/common';

const API_DELAY = Number(process.env.NEXT_PUBLIC_API_DELAY) || 800;

export class MockApiService {
  static async execute<T>(
    operation: () => T | Promise<T>,
    customDelay?: number
  ): Promise<ApiResponse<T>> {
    try {
      await delay(customDelay ?? API_DELAY);
      const data = await operation();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(message: string): ApiResponse {
    return {
      success: false,
      error: message,
    };
  }
}