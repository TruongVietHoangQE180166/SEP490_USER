export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
  FETCH_ERROR = 'FETCH_ERROR',
  UPDATE_ERROR = 'UPDATE_ERROR',
  CREATE_ERROR = 'CREATE_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  timestamp: number;
}