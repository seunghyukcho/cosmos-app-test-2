import { useState } from 'react';
import { fetchAnalyticsData, fetchActionData } from '@app-helpers';
import {
  BarChart3,
  Zap,
  Search,
  Loader2,
  AlertCircle,
  ChevronRight,
  Database,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

function App() {
  const config = (window as any).__COSMOS_APP_CONFIG__ || {};
  const [queryName, setQueryName] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState('');
  const [data, setData] = useState<any>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<any>(null);
  const [actionError, setActionError] = useState('');

  async function runQuery() {
    if (!queryName) return;
    setQueryLoading(true);
    setQueryError('');
    setData(null);
    try {
      const result = await fetchAnalyticsData(queryName);
      setData(result);
    } catch (err: any) {
      setQueryError(err.message);
    } finally {
      setQueryLoading(false);
    }
  }

  async function runAction() {
    setActionLoading(true);
    setActionError('');
    setActionResult(null);
    try {
      const result = await fetchActionData('Sample Action', { key: 'value' });
      setActionResult(result);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Cosmos App</h1>
              <p className="text-xs text-slate-500">{config.graphKey || 'graph'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Database className="h-4 w-4" />}
            label="App Key"
            value={config.appKey || '-'}
            color="violet"
          />
          <StatCard
            icon={<BarChart3 className="h-4 w-4" />}
            label="Analytics"
            value="Ready"
            subtitle="Query data by name"
            color="blue"
          />
          <StatCard
            icon={<Zap className="h-4 w-4" />}
            label="Actions"
            value="Ready"
            subtitle="Execute operations"
            color="amber"
          />
        </div>

        {/* Analytics Query Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Analytics Query</h2>
            <span className="text-xs text-slate-400 ml-auto">fetchAnalyticsData()</span>
          </div>
          <div className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter analytics name..."
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runQuery()}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={runQuery}
                disabled={queryLoading || !queryName}
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
              >
                {queryLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {queryLoading ? 'Running...' : 'Query'}
              </button>
            </div>

            {queryError && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{queryError}</p>
              </div>
            )}

            {data && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">
                    {data.rowCount ?? data.rows?.length ?? 0} rows returned
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {data.type}
                  </span>
                </div>
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-auto max-h-64 font-mono leading-relaxed">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-slate-900">Action Runner</h2>
            <span className="text-xs text-slate-400 ml-auto">fetchActionData()</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-4">
              Execute server-side operations like data updates, external API calls, or workflow triggers.
            </p>
            <button
              onClick={runAction}
              disabled={actionLoading}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {actionLoading ? 'Executing...' : 'Run Sample Action'}
            </button>

            {actionError && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{actionError}</p>
              </div>
            )}

            {actionResult && (
              <div className="mt-4">
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-auto max-h-64 font-mono leading-relaxed">
                  {JSON.stringify(actionResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* Reusable stat card component */
function StatCard({
  icon,
  label,
  value,
  subtitle,
  color = 'violet',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  color?: 'violet' | 'blue' | 'amber' | 'emerald';
}) {
  const colorMap = {
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-semibold text-slate-900 truncate">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default App;
