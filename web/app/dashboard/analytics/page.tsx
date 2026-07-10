"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { BarChart2, TrendingUp, Globe, Building } from "lucide-react";
import { api, type AnalyticsData } from "@/lib/api";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const TIER_COLORS: Record<string, string> = {
  SMALL: "#94a3b8", MEDIUM: "#6366f1", LARGE: "#8b5cf6", ENTERPRISE: "#f59e0b",
};
const COMPLEXITY_COLORS: Record<string, string> = {
  LOW: "#10b981", MEDIUM: "#facc15", HIGH: "#f97316", CRITICAL: "#ef4444",
};
const CHART_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#f97316","#ec4899"];

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950 p-2.5">
          <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
      {children}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--tw-bg-opacity, #1e293b)",
  border: "1px solid #334155",
  borderRadius: 8,
  fontSize: 12,
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => <LoadingSkeleton key={i} variant="stat" />)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-64 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.total_complete === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState icon={<BarChart2 size={48} color="var(--gray-300)" />} title="No analytics yet" description="Analytics will appear once RFPs have been scraped and processed." />
      </div>
    );
  }

  const countriesCount = data.by_country.length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Market intelligence across the procurement landscape.</p>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total RFPs" value={data.total_complete.toString()} icon={BarChart2} />
          <StatCard label="Avg Confidence" value={`${Math.round(data.avg_confidence * 100)}%`} sub="AI extraction accuracy" icon={TrendingUp} />
          <StatCard label="Deadline This Week" value={data.deadline_this_week.toString()} sub="Act fast" icon={TrendingUp} />
          <StatCard label="Countries" value={countriesCount.toString()} sub="Covered" icon={Globe} />
        </div>

        {/* Row 2: line + donut */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <ChartCard title="RFPs Discovered (Last 30 Days)">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.rfps_over_time}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          <div className="col-span-2">
            <ChartCard title="Budget Tier Distribution">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data.by_budget_tier} dataKey="count" nameKey="tier" cx="50%" cy="50%" outerRadius={80} label={({ tier }) => tier}>
                    {data.by_budget_tier.map((entry) => (
                      <Cell key={entry.tier} fill={TIER_COLORS[entry.tier] ?? "#6366f1"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Row 3: agencies + tech stacks */}
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="Top Issuing Agencies">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.top_agencies.slice(0,8)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="agency" tick={{ fontSize: 10 }} width={140} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#6366f1" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Most Demanded Tech Stacks">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.by_category.slice(0,8)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10 }} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[0,4,4,0]}>
                  {data.by_category.slice(0,8).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Row 4: complexity + countries */}
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="Complexity Breakdown">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.by_complexity}>
                <XAxis dataKey="complexity" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {data.by_complexity.map((entry) => (
                    <Cell key={entry.complexity} fill={COMPLEXITY_COLORS[entry.complexity] ?? "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Countries">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.by_country.slice(0,8)}>
                <XAxis dataKey="country" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
