import { IsIn } from 'class-validator';

export class UpdateChallengeStatusDto {
  @IsIn(['inProgress', 'completed'])
  status!: 'inProgress' | 'completed';
}
