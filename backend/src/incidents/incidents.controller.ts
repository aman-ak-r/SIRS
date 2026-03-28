import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { IncidentsService } from './incidents.service';

interface AuthRequest {
  user: {
    sub: number;
    role: Role;
  };
}

@Controller('incidents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @Roles(Role.ENGINEER, Role.ADMIN)
  create(@Body() createIncidentDto: CreateIncidentDto, @Request() req: AuthRequest) {
    return this.incidentsService.create(createIncidentDto, req.user.sub);
  }

  @Get()
  @Roles(Role.ENGINEER, Role.MANAGER, Role.ADMIN)
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get('reports/summary')
  @Roles(Role.MANAGER, Role.ADMIN)
  getSummaryReport() {
    return this.incidentsService.getSummaryReport();
  }

  @Patch(':id/status')
  @Roles(Role.ENGINEER, Role.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.incidentsService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/resolve')
  @Roles(Role.ENGINEER, Role.ADMIN)
  resolveIncident(@Param('id', ParseIntPipe) id: number) {
    return this.incidentsService.resolveIncident(id);
  }
}
