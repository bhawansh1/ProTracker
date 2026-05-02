import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle, Clock, AlertCircle, Briefcase } from 'lucide-react';

interface Stats {
  totalProjects: number;
  totalTasks: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your projects and tasks</p>
      </header>

      <div className="stats-grid">
        <StatCard icon={<Briefcase color="#6366f1" />} label="Projects" value={stats?.totalProjects || 0} color="var(--primary)" />
        <StatCard icon={<AlertCircle color="#f59e0b" />} label="To Do" value={stats?.todo || 0} color="var(--warning)" />
        <StatCard icon={<Clock color="#3b82f6" />} label="In Progress" value={stats?.inProgress || 0} color="#3b82f6" />
        <StatCard icon={<CheckCircle color="#10b981" />} label="Completed" value={stats?.completed || 0} color="var(--success)" />
      </div>

      <div className="dashboard-content">
        <div className="card overdue-card">
          <h3><AlertCircle size={20} color="var(--danger)" /> Overdue Tasks</h3>
          <div className="overdue-value">{stats?.overdue || 0}</div>
          <p>Tasks that need immediate attention</p>
        </div>
      </div>

      <style>{`
        .dashboard-header { margin-bottom: 2rem; }
        .dashboard-header h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.25rem; }
        .dashboard-header p { color: var(--text-muted); }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
        }
        .stat-info h4 { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.25rem; }
        .stat-info .value { font-size: 1.5rem; font-weight: 700; }
        
        .overdue-card {
          max-width: 300px;
          text-align: center;
          border-top: 4px solid var(--danger);
        }
        .overdue-card h3 { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1rem; margin-bottom: 1rem; }
        .overdue-value { font-size: 3rem; font-weight: 800; color: var(--danger); margin-bottom: 0.5rem; }
        .overdue-card p { font-size: 0.875rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
  <div className="card stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <h4>{label}</h4>
      <div className="value" style={{ color }}>{value}</div>
    </div>
  </div>
);

export default Dashboard;
