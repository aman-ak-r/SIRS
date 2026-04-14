import { useEffect, useState } from 'react';
import { getIncidents, getReportSummary } from '../api/incidents';
import { useAuth } from '../context/AuthContext';
import { Incident, IncidentReport } from '../types';

export function DashboardPage() {
  const { token, user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authToken = token;
    if (!authToken) return;

    async function loadData() {
      setError(null);
      try {
        const incidentData = await getIncidents(authToken!);
        setIncidents(incidentData);

        if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
          const reportData = await getReportSummary(authToken!);
          setReport(reportData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      }
    }

    void loadData();
  }, [token, user?.role]);

  const total = incidents.length;
  const high = incidents.filter((item) => item.severity === 'HIGH').length;
  const medium = incidents.filter((item) => item.severity === 'MEDIUM').length;
  const low = incidents.filter((item) => item.severity === 'LOW').length;
  const resolved = incidents.filter((item) => item.status === 'RESOLVED').length;
  const inProgress = incidents.filter((item) => item.status === 'IN_PROGRESS').length;
  const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100);

  return (
    <section className="page-grid">
      <div className="hero-card card">
        <p className="eyebrow">Operations Overview</p>
        <h2>Real-Time Incident Dashboard</h2>
        <p className="muted">
          Track severity trends, response progress, and lifecycle movement in one place.
        </p>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="stats-grid wide-grid">
        <div className="stat-box">
          <h3>Total Incidents</h3>
          <p>{total}</p>
        </div>
        <div className="stat-box accent-red">
          <h3>High Severity</h3>
          <p>{high}</p>
        </div>
        <div className="stat-box accent-gold">
          <h3>Medium Severity</h3>
          <p>{medium}</p>
        </div>
        <div className="stat-box accent-green">
          <h3>Low Severity</h3>
          <p>{low}</p>
        </div>
        <div className="stat-box">
          <h3>In Progress</h3>
          <p>{inProgress}</p>
        </div>
        <div className="stat-box accent-blue">
          <h3>Resolved</h3>
          <p>{resolved}</p>
        </div>
        <div className="stat-box">
          <h3>Resolution Rate</h3>
          <p>{resolutionRate}%</p>
        </div>
      </div>

      <div className="card chart-card">
        <h3>Severity Distribution</h3>
        <div className="bar-group">
          <div className="bar-item">
            <span>HIGH</span>
            <div className="bar-track">
              <div className="bar-fill bar-high" style={{ width: `${total ? (high / total) * 100 : 0}%` }} />
            </div>
            <strong>{high}</strong>
          </div>
          <div className="bar-item">
            <span>MEDIUM</span>
            <div className="bar-track">
              <div
                className="bar-fill bar-medium"
                style={{ width: `${total ? (medium / total) * 100 : 0}%` }}
              />
            </div>
            <strong>{medium}</strong>
          </div>
          <div className="bar-item">
            <span>LOW</span>
            <div className="bar-track">
              <div className="bar-fill bar-low" style={{ width: `${total ? (low / total) * 100 : 0}%` }} />
            </div>
            <strong>{low}</strong>
          </div>
        </div>
      </div>

      {report && (
        <div className="report-box card">
          <h3>Manager Report Summary</h3>
          <div className="report-grid">
            <p>Total: {report.totalIncidents}</p>
            <p>Created: {report.byStatus.created}</p>
            <p>In Progress: {report.byStatus.inProgress}</p>
            <p>Resolved: {report.byStatus.resolved}</p>
            <p>High Severity: {report.highSeverityCount}</p>
            <p>Generated: {new Date(report.generatedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </section>
  );
}
