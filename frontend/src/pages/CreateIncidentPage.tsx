import { FormEvent, useState } from 'react';
import { createIncident } from '../api/incidents';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Button } from '../components/ui/BaseComponents';
import { 
  ShieldAlert, 
  Sparkles, 
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CreateIncidentPage() {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const incident = await createIncident(token, { title, description });
      setMessage(`Incident #${incident.id} created successfully with ${incident.severity} severity.`);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create incident');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold">Report New Incident</h1>
        <p className="text-gray-400 mt-1">Input details to trigger automated severity detection and response workflows.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form Side */}
        <div className="md:col-span-2">
          <GlassCard className="p-8 border-white/10">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Incident Title</label>
                <input
                  placeholder="e.g. Database connection timeout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description & Impact</label>
                <textarea
                  placeholder="Describe the symptoms, systems affected, and urgency..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={5}
                  rows={6}
                  className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors resize-none p-4"
                />
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium px-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Severity is auto-detected based on keywords like 'crash', 'down', or 'failure'.</span>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" isLoading={loading} className="w-full h-12 rounded-xl text-md">
                  Submit Incident
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>

            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  {message}
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        {/* Info Side */}
        <div className="space-y-6">
          <GlassCard className="bg-primary/5 border-primary/20">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Response Rules
            </h3>
            <ul className="space-y-3">
              <TipItem text="High Severity: Triggers immediate alerts to on-call engineers." />
              <TipItem text="Medium Severity: Escalated to managers after 2 hours." />
              <TipItem text="Low Severity: Managed during standard business hours." />
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

const TipItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
    {text}
  </li>
);
