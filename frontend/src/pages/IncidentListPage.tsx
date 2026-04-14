import { useEffect, useState } from 'react';
import { getIncidents, resolveIncident, updateIncidentStatus } from '../api/incidents';
import { useAuth } from '../context/AuthContext';
import { Incident } from '../types';

function severityClass(severity: Incident['severity']) {
  if (severity === 'HIGH') return 'badge badge-high';
  if (severity === 'MEDIUM') return 'badge badge-medium';
  return 'badge badge-low';
}

function statusClass(status: Incident['status']) {
  if (status === 'RESOLVED') return 'badge badge-resolved';
  if (status === 'IN_PROGRESS') return 'badge badge-progress';
  return 'badge badge-created';
}

export function IncidentListPage() {
  const { token, user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadIncidents() {
    if (!token) return;

    try {
      setError(null);
      const data = await getIncidents(token);
      setIncidents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load incidents');
    }
  }

  useEffect(() => {
    void loadIncidents();
  }, [token]);

  async function handleStart(id: number) {
    if (!token) return;

    try {
      await updateIncidentStatus(token, id, 'IN_PROGRESS');
      await loadIncidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function handleResolve(id: number) {
    if (!token) return;

    try {
      await resolveIncident(token, id);
      await loadIncidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve incident');
    }
  }

  const canMutate = user?.role === 'ENGINEER' || user?.role === 'ADMIN';

  return (
    <section className="page-grid">
      <div className="hero-card card">
        <p className="eyebrow">Incident Tracking</p>
        <h2>Live Incident Board</h2>
        <p className="muted">Monitor lifecycle progress and apply resolution actions from a single view.</p>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="incident-list">
        {incidents.length === 0 && (
          <article className="incident-item empty">
            <h3>No incidents yet</h3>
            <p>Create one from the Create page to begin tracking response operations.</p>
          </article>
        )}
        {incidents.map((incident) => (
          <article key={incident.id} className="incident-item">
            <header className="incident-head">
              <h3>
                #{incident.id} {incident.title}
              </h3>
              <div className="badge-row">
                <span className={severityClass(incident.severity)}>{incident.severity}</span>
                <span className={statusClass(incident.status)}>{incident.status}</span>
              </div>
            </header>

            <p className="incident-desc">{incident.description}</p>

            <div className="incident-meta">
              <p>Created By: {incident.createdBy.name}</p>
              <p>Created At: {new Date(incident.createdAt).toLocaleString()}</p>
            </div>

            <div className="action-row">
              {canMutate && incident.status === 'CREATED' && (
                <button className="action-btn" onClick={() => void handleStart(incident.id)}>
                  Move to IN_PROGRESS
                </button>
              )}
              {canMutate && incident.status === 'IN_PROGRESS' && (
                <button className="action-btn resolve-btn" onClick={() => void handleResolve(incident.id)}>
                  Resolve Incident
                </button>
              )}
            </div>

            <details className="log-panel">
              <summary>View Incident Logs</summary>
              <ul>
                {incident.logs.map((log) => (
                  <li key={log.id}>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    <p>{log.action}</p>
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
