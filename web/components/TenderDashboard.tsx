import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface TenderStats {
  total_imported: number;
  by_status: {
    pending: number;
    processing: number;
    complete: number;
  };
}

interface RecentTender {
  id: string;
  title: string;
  issuingAgency: string;
  deadline: string;
  budgetMin?: number;
  budgetMax?: number;
  status: string;
}

const TenderDashboard = () => {
  const [stats, setStats] = useState<TenderStats | null>(null);
  const [recentTenders, setRecentTenders] = useState<RecentTender[]>([]);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/tenders/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch recent tenders
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await fetch('/api/rfps?limit=5');
        if (!response.ok) throw new Error('Failed to fetch tenders');
        const data = await response.json();
        setRecentTenders(data.data || []);
      } catch (err) {
        console.error('Failed to fetch recent tenders:', err);
      }
    };

    fetchRecent();
  }, []);

  // Trigger sync
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/tenders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Sync failed');
      const data = await response.json();
      setSyncStatus(data.status);
      
      // Refresh stats after sync
      setTimeout(async () => {
        const statsResponse = await fetch('/api/tenders/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  const statusData = [
    { name: 'Pending', value: stats?.by_status.pending || 0, color: '#f59e0b' },
    { name: 'Processing', value: stats?.by_status.processing || 0, color: '#3b82f6' },
    { name: 'Complete', value: stats?.by_status.complete || 0, color: '#10b981' },
  ];

  const chartData = [
    { name: 'Pending', value: stats?.by_status.pending || 0 },
    { name: 'Processing', value: stats?.by_status.processing || 0 },
    { name: 'Complete', value: stats?.by_status.complete || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tender Import Dashboard</h1>
          <p className="text-slate-400">Real-time monitoring of tech tenders from TenderFlow Uganda</p>
        </div>

        {/* Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Imported</p>
                <p className="text-3xl font-bold text-white mt-1">{stats?.total_imported || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Processing</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats?.by_status.pending || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Processing</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">{stats?.by_status.processing || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{stats?.by_status.complete || 0}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Sync Control */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Tender Sync</h3>
              <p className="text-slate-400 text-sm mt-1">
                Status: <span className="text-emerald-400 font-medium">{syncStatus || 'idle'}</span>
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-3">
            Scheduled syncs run daily at 2 AM UTC and every 6 hours. Last sync will show here.
          </p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution Pie Chart */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Bar Chart */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Import Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tenders Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Recent Tenders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Issuer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentTenders.length > 0 ? (
                  recentTenders.map((tender) => (
                    <tr key={tender.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-medium truncate max-w-md">
                        {tender.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{tender.issuingAgency}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {tender.budgetMin && tender.budgetMax
                          ? `$${(tender.budgetMin / 1000000).toFixed(1)}M - $${(tender.budgetMax / 1000000).toFixed(1)}M`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {new Date(tender.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tender.status === 'COMPLETE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tender.status === 'PROCESSING'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {tender.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No tenders imported yet. Click "Sync Now" to import.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Auto-refreshing dashboard  Last update: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TenderDashboard;
