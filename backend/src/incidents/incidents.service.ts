import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IncidentStatus, Severity } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SeverityAssignerService } from './severity-assigner.service';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly severityAssignerService: SeverityAssignerService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createIncidentDto: CreateIncidentDto, createdById: number) {
    const severity = this.severityAssignerService.assignSeverity(
      createIncidentDto.title,
      createIncidentDto.description,
    );

    const incident = await this.prisma.incident.create({
      data: {
        title: createIncidentDto.title,
        description: createIncidentDto.description,
        severity,
        status: IncidentStatus.CREATED,
        createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    await this.logAction(incident.id, `Incident created with severity ${incident.severity}`);
    await this.notificationsService.notifyOnIncidentCreated(incident.id, incident.title, incident.severity);

    return incident;
  }

  findAll() {
    return this.prisma.incident.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        logs: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSummaryReport() {
    const [total, created, inProgress, resolved, highSeverity] = await Promise.all([
      this.prisma.incident.count(),
      this.prisma.incident.count({ where: { status: IncidentStatus.CREATED } }),
      this.prisma.incident.count({ where: { status: IncidentStatus.IN_PROGRESS } }),
      this.prisma.incident.count({ where: { status: IncidentStatus.RESOLVED } }),
      this.prisma.incident.count({ where: { severity: Severity.HIGH } }),
    ]);

    return {
      totalIncidents: total,
      byStatus: {
        created,
        inProgress,
        resolved,
      },
      highSeverityCount: highSeverity,
      generatedAt: new Date().toISOString(),
    };
  }

  async updateStatus(incidentId: number, dto: UpdateStatusDto) {
    const incident = await this.getIncidentOrThrow(incidentId);

    if (dto.status === IncidentStatus.RESOLVED) {
      throw new BadRequestException('Use /resolve endpoint to mark incident as resolved');
    }

    this.validateTransition(incident.status, dto.status);

    const updated = await this.prisma.incident.update({
      where: { id: incidentId },
      data: { status: dto.status },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        logs: true,
      },
    });

    await this.logAction(incidentId, `Status changed from ${incident.status} to ${dto.status}`);
    return updated;
  }

  async resolveIncident(incidentId: number) {
    const incident = await this.getIncidentOrThrow(incidentId);
    this.validateTransition(incident.status, IncidentStatus.RESOLVED);

    const updated = await this.prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: IncidentStatus.RESOLVED,
        resolvedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        logs: true,
      },
    });

    await this.logAction(incidentId, 'Incident resolved');
    return updated;
  }

  private async logAction(incidentId: number, action: string): Promise<void> {
    await this.prisma.incidentLog.create({
      data: {
        incidentId,
        action,
      },
    });
  }

  private async getIncidentOrThrow(id: number) {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    return incident;
  }

  private validateTransition(current: IncidentStatus, next: IncidentStatus): void {
    const allowedTransitions: Record<IncidentStatus, IncidentStatus[]> = {
      [IncidentStatus.CREATED]: [IncidentStatus.IN_PROGRESS],
      [IncidentStatus.IN_PROGRESS]: [IncidentStatus.RESOLVED],
      [IncidentStatus.RESOLVED]: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(
        `Invalid status transition: ${current} -> ${next}. Allowed: ${allowedTransitions[current].join(', ') || 'none'}`,
      );
    }
  }
}
