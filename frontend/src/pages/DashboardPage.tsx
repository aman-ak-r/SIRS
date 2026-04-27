import { useEffect, useState } from 'react';
import { getIncidents, getReportSummary } from '../api/incidents';
import { useAuth } from '../context/AuthContext';
import { Incident, IncidentReport } from '../types';
import { GlassCard, Button } from '../components/ui/BaseComponents';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck,
  Calendar,
  Zap,
  List
} from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const { token, user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = token;
    if (!authToken) return;

    async function loadData() {
      setError(null);
      setLoading(true);
      try {
        const incidentData = await getIncidents(authToken!);
        setIncidents(incidentData);

        if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
          const reportData = await getReportSummary(authToken!);
          setReport(reportData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Operations Overview</h1>
          <p className="text-gray-400 mt-1">Real-time status of system incidents and response lifecycle.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<List className="text-blue-400" />} 
          title="Total Incidents" 
          value={total} 
          trend="+5% from yesterday" 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-green-400" />} 
          title="Resolved" 
          value={resolved} 
          trend={`${resolutionRate}% rate`}
        />
        <StatCard 
          icon={<Clock className="text-amber-400" />} 
          title="In Progress" 
          value={inProgress} 
          trend="Avg 14m MTTR"
        />
        <StatCard 
          icon={<ShieldAlert className="text-red-400" />} 
          title="High Severity" 
          value={high} 
          trend="Critical Alerts"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Severity Distribution
            </h3>
            <select className="bg-white/5 border-white/10 rounded-lg text-xs px-3 py-1 text-gray-400 outline-none">
              <option>Today</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="space-y-6">
            <ProgressBar label="HIGH" count={high} total={total} color="bg-accent-red" />
            <ProgressBar label="MEDIUM" count={medium} total={total} color="bg-accent-amber" />
            <ProgressBar label="LOW" count={low} total={total} color="bg-accent-green" />
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{resolutionRate}%</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Resolution Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{inProgress}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Trials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total - resolved}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Open Issues</div>
            </div>
          </div>
        </GlassCard>

        {/* Report Card for Managers */}
        <div className="space-y-6">
          {report && (
            <GlassCard className="bg-primary/5 border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Manager Summary
              </h3>
              <div className="space-y-4">
                <ReportItem label="Total Incidents" value={report.totalIncidents} />
                <ReportItem label="Current Open" value={report.byStatus.created} />
                <ReportItem label="In Progress" value={report.byStatus.inProgress} />
                <ReportItem label="High Severity" value={report.highSeverityCount} />
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Last Generated</span>
                <span className="text-xs text-gray-400">{new Date(report.generatedAt).toLocaleTimeString()}</span>
              </div>
            </GlassCard>
          )}
          
          <GlassCard>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Quick Actions
            </h3>
            <div className="grid gap-3">
              <Button size="sm" variant="secondary" className="justify-start px-4">Download PDF Report</Button>
              <Button size="sm" variant="secondary" className="justify-start px-4">Export CSV Data</Button>
              <Button size="sm" variant="secondary" className="justify-start px-4 text-red-400 hover:text-red-400">System Shutdown</Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, trend }: any) => (
  <GlassCard className="flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
    </div>
    <div className="flex items-end justify-between">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">
        {trend}
      </div>
    </div>
  </GlassCard>
);

const ProgressBar = ({ label, count, total, color }: any) => {
  const percentage = total === 0 ? 0 : (count / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold">{count}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`} 
        />
      </div>
    </div>
  );
};

const ReportItem = ({ label, value }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="font-bold text-white">{value}</span>
  </div>
);

