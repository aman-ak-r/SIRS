import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginRegisterPage } from './pages/LoginRegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateIncidentPage } from './pages/CreateIncidentPage';
import { IncidentListPage } from './pages/IncidentListPage';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LogOut, LayoutDashboard, FilePlus, ListFilter, User as UserIcon } from 'lucide-react';
import { Button } from './components/ui/BaseComponents';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  if (!user && !isPublicPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3 border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">S</div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block">SIRS</span>
        </div>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-gray-400'}`}>
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </NavLink>
              <NavLink to="/incidents/new" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-gray-400'}`}>
                <FilePlus className="w-4 h-4" />
                <span className="text-sm font-medium">Create Incident</span>
              </NavLink>
              <NavLink to="/incidents" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-gray-400'}`}>
                <ListFilter className="w-4 h-4" />
                <span className="text-sm font-medium">Incident Board</span>
              </NavLink>
            </div>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-white leading-none">{user.name}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">{user.role.replace('_', ' ')}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-400">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" onClick={() => navigate('/login')}>Get Started</Button>
          </div>
        )}
      </div>
    </nav>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { token } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
      </Routes>
    </>
  );
}
