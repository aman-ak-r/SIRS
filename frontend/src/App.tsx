import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginRegisterPage } from './pages/LoginRegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateIncidentPage } from './pages/CreateIncidentPage';
import { IncidentListPage } from './pages/IncidentListPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function Header() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header className="topbar">
      <div className="brand-wrap">
        <p className="eyebrow">Smart Incident Response System</p>
        <h1>Incident Command Center</h1>
      </div>
      <nav className="topbar-nav">
        <NavLink
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          to="/dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          to="/incidents/new"
        >
          Create
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/incidents">
          Incidents
        </NavLink>
      </nav>
      <div className="user-chip">
        <div>
          <strong>{user.name}</strong>
          <p>{user.role}</p>
        </div>
        <button className="ghost-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

function AppShell({ children }: { children: JSX.Element }) {
  return (
    <div className="app-shell">
      <div className="bg-layer bg-layer-a" />
      <div className="bg-layer bg-layer-b" />
      <div className="container">
        <Header />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const { token } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell>
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents/new"
          element={
            <ProtectedRoute>
              <AppShell>
                <CreateIncidentPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <AppShell>
                <IncidentListPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </>
  );
}
