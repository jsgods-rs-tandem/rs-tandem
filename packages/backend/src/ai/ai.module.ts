import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AiSettingsRepository } from './ai-settings.repository.js';
import { AiService } from './ai.service.js';
import { AiController } from './ai.controller.js';
import { AiThrottlerGuard } from './guards/ai-throttler.guard.js';
import { AuthModule } from '../auth/auth.module.js';
import { AiGateway } from './ai.gateway.js';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]), AuthModule],
  providers: [AiSettingsRepository, AiService, AiThrottlerGuard, AiGateway],
  controllers: [AiController],
})
export class AiModule {}
