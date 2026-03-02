import type { UserDto } from '@rs-tandem/shared';

declare global {
  namespace Express {
    interface User extends UserDto {}
  }
}

export {};
