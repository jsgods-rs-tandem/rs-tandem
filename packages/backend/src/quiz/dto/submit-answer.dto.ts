import { IsBoolean, IsString } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  answerId!: string;

  @IsBoolean()
  isTimeUp!: boolean;
}
