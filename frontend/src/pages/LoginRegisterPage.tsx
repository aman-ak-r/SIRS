import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export function LoginRegisterPage() {
  const { login: saveSession, token } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('ENGINEER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response =
        mode === 'login'
          ? await login({ email, password })
          : await register({ name, email, password, role });

      saveSession(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-panel">
        <p className="eyebrow">SIRS Platform</p>
        <h1>Respond Faster. Resolve Smarter.</h1>
        <p>
          A role-aware incident response platform for engineering teams, managers, and operational leadership.
        </p>
        <ul>
          <li>Rule-based severity classification</li>
          <li>Lifecycle transitions with audit logs</li>
          <li>Role-driven reporting and access control</li>
        </ul>
      </aside>

      <div className="card auth-card">
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="muted">
          {mode === 'login'
            ? 'Sign in to monitor incidents and lifecycle progress.'
            : 'Register a role-specific account for the incident response workspace.'}
        </p>
        <form onSubmit={onSubmit} className="form">
          {mode === 'register' && (
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          )}

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {mode === 'register' && (
            <label>
              Role
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="ENGINEER">ENGINEER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading} className="action-btn">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <button className="secondary-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
