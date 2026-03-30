import { IsIn, IsString } from 'class-validator';
import type { UpdateAiSettingsDto as IUpdateAiSettingsDto } from '@rs-tandem/shared';
import { AI_PROVIDER_IDS } from '../providers/ai-provider.registry.js';

export class UpdateAiSettingsDto implements IUpdateAiSettingsDto {
  @IsString()
  @IsIn(AI_PROVIDER_IDS)
  providerId!: string;
  model!: string | null;
  apiKey!: string | null;
}
