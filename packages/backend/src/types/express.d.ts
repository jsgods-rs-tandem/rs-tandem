import type { UserDto } from '@rs-tandem/shared';
import type { IncomingHttpHeaders } from 'http';

declare global {
  namespace Express {
    interface User extends UserDto {}

    interface Request {
      headers: IncomingHttpHeaders;
    }
  }
}

export {};
