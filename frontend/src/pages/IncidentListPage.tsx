import { useEffect, useState } from 'react';
import { getIncidents, resolveIncident, updateIncidentStatus } from '../api/incidents';
import { useAuth } from '../context/AuthContext';
import { Incident } from '../types';
import { GlassCard, Button } from '../components/ui/BaseComponents';
import { 
  Search, 
  Filter, 
  Activity, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  FileText,
  History,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function IncidentListPage() {
  const { token, user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  async function loadIncidents() {
    if (!token) return;
    try {
      setError(null);
      const data = await getIncidents(token);
      setIncidents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load incidents');
    } finally {
      setLoading(false);
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

  const filteredIncidents = filter === 'ALL' 
    ? incidents 
    : incidents.filter(i => i.status === filter);

  const canMutate = user?.role === 'ENGINEER' || user?.role === 'ADMIN';

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Incident Board</h1>
          <p className="text-gray-400 mt-1">Live tracking and management of all system incidents.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              placeholder="Search incidents..." 
              className="pl-10 pr-4 py-2 bg-white/5 border-white/10 rounded-xl text-sm w-full md:w-64 focus:border-primary/50"
            />
          </div>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border-white/10">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none text-sm text-gray-300 outline-none p-0 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="CREATED">Created</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredIncidents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass rounded-3xl border-dashed border-white/10"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No incidents found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Create a new incident from the intake form to start tracking response operations.</p>
              </motion.div>
            ) : (
              filteredIncidents.map((incident) => (
                <IncidentItem 
                  key={incident.id} 
                  incident={incident} 
                  canMutate={canMutate}
                  onStart={() => handleStart(incident.id)}
                  onResolve={() => handleResolve(incident.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function IncidentItem({ incident, canMutate, onStart, onResolve }: any) {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="hover:border-primary/20 transition-colors">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg ${incident.severity === 'HIGH' ? 'bg-red-500 shadow-red-500/20' : incident.severity === 'MEDIUM' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-green-500 shadow-green-500/20'}`}>
                  {incident.severity.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold font-display tracking-tight">{incident.title}</h3>
                    <StatusBadge status={incident.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">ID: #{incident.id}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(incident.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <SeverityBadge severity={incident.severity} />
            </div>

            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
              {incident.description}
            </p>
          </div>

          {/* Actions */}
          <div className="lg:w-64 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">Reported By</span>
                <span className="text-white">{incident.createdBy.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">Severity</span>
                <span className={`font-bold ${incident.severity === 'HIGH' ? 'text-red-400' : incident.severity === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'}`}>
                  {incident.severity}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {canMutate && incident.status === 'CREATED' && (
                <Button onClick={onStart} className="w-full text-sm py-2">
                  Move to IN_PROGRESS
                </Button>
              )}
              {canMutate && incident.status === 'IN_PROGRESS' && (
                <Button onClick={onResolve} className="w-full text-sm py-2 bg-accent-green hover:bg-green-600">
                  Resolve Incident
                </Button>
              )}
              <button 
                onClick={() => setShowLogs(!showLogs)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                <History className="w-3 h-3" />
                {showLogs ? 'Hide Logs' : 'View Logs'}
              </button>
            </div>
          </div>
        </div>

        {/* Logs */}
        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Audit History
                </h4>
                <div className="space-y-3 pl-2">
                  {incident.logs.map((log: any) => (
                    <div key={log.id} className="relative pl-6 pb-2 border-l border-white/5 last:border-0 last:pb-0">
                      <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-[10px] font-medium mb-1">{new Date(log.timestamp).toLocaleString()}</span>
                        <p className="text-gray-300 text-xs font-medium">{log.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    CREATED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    RESOLVED: 'bg-green-500/10 text-green-400 border-green-500/20'
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: any) {
  const styles: any = {
    HIGH: 'text-red-400 border-red-400/20',
    MEDIUM: 'text-amber-400 border-amber-400/20',
    LOW: 'text-green-400 border-green-400/20'
  };
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border bg-white/5 ${styles[severity]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${severity === 'HIGH' ? 'bg-red-400' : severity === 'MEDIUM' ? 'bg-amber-400' : 'bg-green-400'}`} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{severity}</span>
    </div>
  );
}
