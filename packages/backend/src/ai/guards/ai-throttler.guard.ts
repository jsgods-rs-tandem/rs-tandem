import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AiThrottlerGuard extends ThrottlerGuard {
  protected override getTracker(request: Record<string, unknown>): Promise<string> {
    const user = (request as { user?: { id?: string } }).user;

    return Promise.resolve(user?.id ?? (request as { ip?: string }).ip ?? 'unknown');
  }
}
