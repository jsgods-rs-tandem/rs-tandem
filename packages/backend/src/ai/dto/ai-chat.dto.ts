import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { AiChatRequestDto as IAiChatRequestDto, AiMessage } from '@rs-tandem/shared';

class AiMessageDto implements AiMessage {
  @IsIn(['user', 'assistant', 'system'])
  role!: 'user' | 'assistant' | 'system';

  @IsString()
  @MinLength(1)
  content!: string;
}

export class AiChatDto implements IAiChatRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AiMessageDto)
  messages!: AiMessageDto[];

  @IsOptional()
  @IsString()
  lessonId?: string;
}
