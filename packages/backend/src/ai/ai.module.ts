import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AiSettingsRepository } from './ai-settings.repository.js';
import { AiService } from './ai.service.js';
import { AiController } from './ai.controller.js';
import { AiThrottlerGuard } from './guards/ai-throttler.guard.js';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }])],
  providers: [AiSettingsRepository, AiService, AiThrottlerGuard],
  controllers: [AiController],
})
export class AiModule {}
