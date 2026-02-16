export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  data: null;
  success: false;
  message: string;
  timestamp: string;
}
