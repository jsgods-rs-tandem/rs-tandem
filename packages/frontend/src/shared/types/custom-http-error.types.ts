import type { HttpErrorResponse } from '@angular/common/http';

interface CustomHttpError extends HttpErrorResponse {
  error: {
    error: string;
    message: string;
    statusCode: number;
  };
}

export type { CustomHttpError };
