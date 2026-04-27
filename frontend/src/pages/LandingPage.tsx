import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  Zap, 
  Shield, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import { Button, GlassCard } from '../components/ui/BaseComponents';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-height-screen bg-background text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Smart Operations for Modern Teams</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Respond Faster <br />
              <span className="text-gradient">Resolve Smarter</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              SIRS is an intelligent incident response platform that helps engineering teams manage, track, and resolve system issues with AI-driven severity detection and automated workflows.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto group">
                Enter Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                System Status
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full" />
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Incidents Resolved', value: '12k+' },
              { label: 'Active Teams', value: '450+' },
              { label: 'Avg MTTR', value: '14m' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Mission Critical Response</h2>
            <p className="text-gray-400">Everything you need to maintain system reliability and keep your customers happy.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldAlert className="text-red-400" />}
              title="Severity Detection"
              description="Automatic classification of incidents using keyword analysis and impact assessment."
            />
            <FeatureCard 
              icon={<Activity className="text-purple-400" />}
              title="Lifecycle Tracking"
              description="Full audit logs for every transition from creation to final resolution."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-cyan-400" />}
              title="Operations Intelligence"
              description="Deep insights into system stability and team response performance."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">S</div>
            <span className="font-display font-bold text-xl tracking-tight">SIRS Platform</span>
          </div>
          <p className="text-gray-500 text-sm mb-8">© 2026 Smart Incident Response System. Built for reliability.</p>
          <div className="flex justify-center gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <GlassCard className="hover:-translate-y-2 transition-transform duration-300">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </GlassCard>
);
