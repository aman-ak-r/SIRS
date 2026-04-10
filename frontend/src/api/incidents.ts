import { apiRequest } from './client';
import { Incident, IncidentReport, IncidentStatus } from '../types';

export function createIncident(token: string, payload: { title: string; description: string }) {
  return apiRequest<Incident>('/incidents', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function getIncidents(token: string) {
  return apiRequest<Incident[]>('/incidents', { token });
}

export function updateIncidentStatus(token: string, incidentId: number, status: IncidentStatus) {
  return apiRequest<Incident>(`/incidents/${incidentId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });
}

export function resolveIncident(token: string, incidentId: number) {
  return apiRequest<Incident>(`/incidents/${incidentId}/resolve`, {
    method: 'PATCH',
    token,
  });
}

export function getReportSummary(token: string) {
  return apiRequest<IncidentReport>('/incidents/reports/summary', { token });
}
