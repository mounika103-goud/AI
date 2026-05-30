import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Clock, UserPlus, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { patientAPI } from '../api';
import DashboardCard from '../components/DashboardCard';
import { getRiskLevel } from '../components/PredictionCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // calculate dashboard stats
  const stats = useMemo(() => {
    const total = patients.length;
    const highRisk = patients.filter(p => getRiskLevel(p.remarks).level === 'High Risk').length;
    const normal = patients.filter(p => getRiskLevel(p.remarks).level === 'Normal').length;

    // TODO: maybe change this to 30 days later?
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = patients.filter(p => new Date(p.created_at) >= weekAgo).length;

    return { total, highRisk, normal, recent };
  }, [patients]);


  const pieData = useMemo(() => {
    const high = patients.filter(p => getRiskLevel(p.remarks).level === 'High Risk').length;
    const moderate = patients.filter(p => getRiskLevel(p.remarks).level === 'Moderate').length;
    const normal = patients.filter(p => getRiskLevel(p.remarks).level === 'Normal').length;
    return [
      { name: 'High Risk', value: high, color: '#ef4444' },
      { name: 'Moderate', value: moderate, color: '#f59e0b' },
      { name: 'Normal', value: normal, color: '#10b981' },
    ].filter(d => d.value > 0);
  }, [patients]);

  // format data for the charts
  const trendData = useMemo(() => {
    const groups = {};
    // group by date

    patients.forEach(p => {
      const date = new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      groups[date] = (groups[date] || 0) + 1;
    });
    return Object.entries(groups).map(([date, count]) => ({ date, count })).slice(-10);
  }, [patients]);

  const recentPatients = useMemo(() => {
    // get top 5 latest
    return [...patients]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [patients]);

  if (loading) return <Loader type="skeleton-cards" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of patient health analytics</p>
        </div>
        <Link to="/add-patient" className="btn-primary-custom">
          <UserPlus size={18} /> Add Patient
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        <DashboardCard icon={Users} value={stats.total} label="Total Patients" gradient="gradient-teal" delay={0} />
        <DashboardCard icon={AlertTriangle} value={stats.highRisk} label="High Risk" gradient="gradient-rose" delay={0.1} />
        <DashboardCard icon={CheckCircle} value={stats.normal} label="Normal" gradient="gradient-blue" delay={0.2} />
        <DashboardCard icon={Clock} value={stats.recent} label="This Week" gradient="gradient-amber" delay={0.3} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <motion.div
          className="glass-card chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Patient Registrations</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', fontSize: '0.85rem'
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={2} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
              No data yet. Add patients to see trends.
            </p>
          )}
        </motion.div>

        <motion.div
          className="glass-card chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Risk Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
              No data available.
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '4px' }}>
            {pieData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="glass-card"
        style={{ padding: '24px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="section-heading">Recent Activity</h3>
        {recentPatients.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent activity.</p>
        ) : (
          recentPatients.map(patient => {
            const risk = getRiskLevel(patient.remarks);
            return (
              <div className="activity-item" key={patient.id}>
                <div className="activity-dot" style={{ background: risk.color }} />
                <div>
                  <div className="activity-text">
                    <strong>{patient.full_name}</strong> — {patient.remarks?.substring(0, 60)}
                    {patient.remarks?.length > 60 ? '...' : ''}
                  </div>
                  <div className="activity-time">
                    {new Date(patient.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
