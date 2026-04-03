export type ErrorCode = 'OPENROUTER_ERROR' | 'OLLAMA_ERROR';

export const title: Record<ErrorCode, string> = {
  OPENROUTER_ERROR: 'Open Router',
  OLLAMA_ERROR: 'Ollama',
};

type keys =
  | 'BadRequest'
  | 'Unauthorized'
  | 'PaymentRequired'
  | 'Forbidden'
  | 'NotFound'
  | 'RequestTimeout'
  | 'Conflict'
  | 'UnprocessableEntity'
  | 'TooManyRequests'
  | 'InternalServerError'
  | 'BadGateway'
  | 'ServiceUnavailable'
  | 'GatewayTimeout';

export const error: Record<keys, number> = {
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  RequestTimeout: 408,
  Conflict: 409,
  UnprocessableEntity: 422,
  TooManyRequests: 429,

  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
} as const;
