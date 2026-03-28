import { IncidentStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(IncidentStatus)
  status!: IncidentStatus;
}
