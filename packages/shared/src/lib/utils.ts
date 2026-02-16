import { ApiErrorResponse, ApiSuccessResponse } from './types';

export function createApiResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
  return {
    data,
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(message: string): ApiErrorResponse {
  return {
    data: null,
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
}
