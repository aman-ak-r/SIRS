import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Button, GlassCard } from '../components/ui/BaseComponents';
import { ShieldCheck, Mail, Lock, User, Briefcase, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginRegisterPage() {
  const { login: saveSession, token } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-background grid lg:grid-cols-2 overflow-hidden">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex flex-col justify-center px-12 xl:px-24 bg-gradient-to-br from-blue-900/20 to-purple-900/20 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-10 grayscale" />
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-xl shadow-blue-500/20">S</div>
              <span className="font-display font-bold text-2xl tracking-tight">SIRS</span>
            </div>
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
              Maintain Reliability <br />
              <span className="text-gradient">Resolve Fast</span>
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              SIRS helps your engineering team stay on top of critical incidents with AI-driven severity tracking and role-based response.
            </p>
            <div className="space-y-6">
              {[
                { icon: <ShieldCheck className="text-blue-400" />, text: "Rule-based severity classification" },
                { icon: <Sparkles className="text-purple-400" />, text: "Automated incident lifecycle tracking" },
                { icon: <Activity className="text-cyan-400" />, text: "Comprehensive audit logs and history" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 sm:p-10 border-white/10 shadow-3xl">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-display font-bold mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Join SIRS'}
              </h2>
              <p className="text-gray-400 text-sm">
                {mode === 'login' 
                  ? 'Sign in to access the incident command center.' 
                  : 'Register a role-specific account for your organization.'}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      className="pl-11 bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="pl-11 bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    className="pl-11 bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Organization Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="pl-11 bg-white/5 border-white/10 focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="ENGINEER">ENGINEER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="ADMIN">ADMINISTRATOR</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-medium"
                >
                  {error}
                </motion.div>
              )}

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-md">
                {loading ? 'Authenticating...' : mode === 'login' ? 'Login' : 'Create Account'}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <button 
                className="text-gray-400 hover:text-white text-sm transition-colors font-medium"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? "New to SIRS? Register" : "Already have an account? Sign In"}
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
