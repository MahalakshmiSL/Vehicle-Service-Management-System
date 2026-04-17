import { useState, useEffect } from 'react';
import { getDailyRevenue, getMonthlyRevenue, getYearlyRevenue, getVehicles, getIssues, getPayments } from '../api';
import { PageHeader, StatCard, Card, Loader, toast } from '../components/UI';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label, prefix = '₹' }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <p style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--red)' }}>{prefix}{Number(payload[0].value).toLocaleString()}</p>
    </div>
  );
};
const formatData = (data, key) => {
  return data.map(item => ({
    ...item,
    [key]: item[key]?.split("T")[0] // clean date
  }));
};
export default function Dashboard() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [issues, setIssues] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('monthly');
useEffect(() => {
  getDailyRevenue().then(r => setDaily(formatData(r.data, "date")));
  getMonthlyRevenue().then(r => setMonthly(formatData(r.data, "month")));
  getYearlyRevenue().then(r => setYearly(formatData(r.data, "year")));
}, []);
  useEffect(() => {
    const load = async () => {
      try {
        const [d, m, y, v, i, p] = await Promise.all([
          getDailyRevenue(), getMonthlyRevenue(), getYearlyRevenue(),
          import('../api').then(a => a.getVehicles()),
          import('../api').then(a => a.getIssues()),
          import('../api').then(a => a.getPayments()),
        ]);
        setDaily(d.data.map(item => ({ ...item, revenue: Number(item.revenue) })));
        setMonthly(m.data.map(item => ({ ...item, revenue: Number(item.revenue) })));
        setYearly(y.data.map(item => ({ ...item, revenue: Number(item.revenue) })));
        setVehicles(v.data);
        setIssues(i.data);
        setPayments(p.data);
      } catch {
        toast('Failed to load revenue data', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const thisMonthRevenue = monthly.length ? monthly[monthly.length - 1]?.revenue || 0 : 0;
  const avgMonthly = monthly.length ? monthly.reduce((s, m) => s + m.revenue, 0) / monthly.length : 0;

  const chartData = { daily, monthly, yearly };
  const xKey = { daily: 'date', monthly: 'month', yearly: 'year' };

  return (
    <div className="fade-up">
      <PageHeader title="Revenue Dashboard" subtitle="Financial performance overview" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Revenue" value={`₹${Math.round(totalRevenue).toLocaleString()}`} accent />
        <StatCard label="This Month" value={`₹${Math.round(thisMonthRevenue).toLocaleString()}`} />
        <StatCard label="Avg Monthly" value={`₹${Math.round(avgMonthly).toLocaleString()}`} />
        <StatCard label="Vehicles Served" value={vehicles.filter(v => v.status === 'completed').length} />
      </div>

      {/* Main Revenue Chart */}
      <Card style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Revenue Trend</h2>
            <p style={{ fontSize: 13, color: 'var(--gray)', marginTop: 2 }}>Total income from completed payments</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['daily', 'monthly', 'yearly'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '6px 16px', borderRadius: 99, border: 'none', cursor: 'pointer',
                background: tab === t ? 'var(--red)' : 'var(--gray-light)',
                color: tab === t ? 'white' : 'var(--dark)',
                fontWeight: 600, fontSize: 13, textTransform: 'capitalize', transition: 'all 0.2s',
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading ? <Loader /> : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData[tab]} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cc2200" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#cc2200" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xKey[tab]} tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#cc2200" strokeWidth={2.5} fill="url(#redGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Two charts side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Monthly Bars</h3>
          {loading ? <Loader /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#cc2200" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Yearly Revenue</h3>
          {loading ? <Loader /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#111111" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Activity overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Vehicle Status</h3>
          {['pending', 'in_progress', 'completed'].map(s => {
            const count = vehicles.filter(v => v.status === s).length;
            const pct = vehicles.length ? Math.round((count / vehicles.length) * 100) : 0;
            const colors = { pending: '#f59e0b', in_progress: '#3b82f6', completed: '#16a34a' };
            return (
              <div key={s} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{s.replace('_', ' ')}</span>
                  <span style={{ fontSize: 13, color: 'var(--gray)' }}>{count} ({pct}%)</span>
                </div>
                <div style={{ background: 'var(--gray-light)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: colors[s], borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Issue Overview</h3>
          {['open', 'resolved'].map(s => {
            const count = issues.filter(i => i.status === s).length;
            const pct = issues.length ? Math.round((count / issues.length) * 100) : 0;
            const color = s === 'open' ? '#cc2200' : '#16a34a';
            return (
              <div key={s} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{s}</span>
                  <span style={{ fontSize: 13, color: 'var(--gray)' }}>{count} ({pct}%)</span>
                </div>
                <div style={{ background: 'var(--gray-light)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>New Part Jobs</p>
              <p style={{ fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-display)' }}>{issues.filter(i => i.service_type === 'new_part').length}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>Repair Jobs</p>
              <p style={{ fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-display)' }}>{issues.filter(i => i.service_type === 'repair').length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}