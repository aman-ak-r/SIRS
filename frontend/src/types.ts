export type Role = 'ADMIN' | 'ENGINEER' | 'MANAGER';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';
export type IncidentStatus = 'CREATED' | 'IN_PROGRESS' | 'RESOLVED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface IncidentLog {
  id: number;
  incidentId: number;
  action: string;
  timestamp: string;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  createdAt: string;
  resolvedAt: string | null;
  createdBy: User;
  logs: IncidentLog[];
}

export interface IncidentReport {
  totalIncidents: number;
  byStatus: {
    created: number;
    inProgress: number;
    resolved: number;
  };
  highSeverityCount: number;
  generatedAt: string;
}
