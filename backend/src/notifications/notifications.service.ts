import { Injectable } from '@nestjs/common';
import { Role, Severity } from '@prisma/client';

@Injectable()
export class NotificationsService {
  async notifyOnIncidentCreated(incidentId: number, title: string, severity: Severity): Promise<void> {
    const engineerNotification = {
      incidentId,
      audience: [Role.ENGINEER],
      message: `Incident created: ${title} (${severity})`,
    };

    console.log('[Notification]', engineerNotification);

    if (severity === Severity.HIGH) {
      const highSeverityNotification = {
        incidentId,
        audience: [Role.ADMIN, Role.MANAGER],
        message: `High severity alert: ${title}. Immediate attention required.`,
      };

      console.log('[Notification]', highSeverityNotification);
    }
  }
}
