import { FormEvent, useState } from 'react';
import { createIncident } from '../api/incidents';
import { useAuth } from '../context/AuthContext';

export function CreateIncidentPage() {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setMessage(null);
    setError(null);

    try {
      const incident = await createIncident(token, { title, description });
      setMessage(`Incident #${incident.id} created with severity ${incident.severity}`);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create incident');
    }
  }

  return (
    <section className="page-grid">
      <div className="hero-card card">
        <p className="eyebrow">Incident Intake</p>
        <h2>Create a New Incident</h2>
        <p className="muted">
          High severity is auto-detected using keywords like <code>crash</code>, <code>down</code>, and{' '}
          <code>failure</code>.
        </p>
      </div>

      <div className="card form-card">
        <form className="form" onSubmit={onSubmit}>
          <label>
            Incident Title
            <input
              placeholder="Example: Payment API is down"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
            />
          </label>

          <label>
            Incident Description
            <textarea
              placeholder="Describe impact, symptoms, and urgency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={5}
            />
          </label>

          <button type="submit" className="action-btn">
            Submit Incident
          </button>
        </form>
      </div>

      {message && <p className="success status-message">{message}</p>}
      {error && <p className="error status-message">{error}</p>}
    </section>
  );
}
