import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { SeverityAssignerService } from './severity-assigner.service';
import { HighSeverityStrategy } from './strategies/high-severity.strategy';
import { MediumSeverityStrategy } from './strategies/medium-severity.strategy';
import { LowSeverityStrategy } from './strategies/low-severity.strategy';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [IncidentsController],
  providers: [
    IncidentsService,
    SeverityAssignerService,
    HighSeverityStrategy,
    MediumSeverityStrategy,
    LowSeverityStrategy,
  ],
})
export class IncidentsModule {}
