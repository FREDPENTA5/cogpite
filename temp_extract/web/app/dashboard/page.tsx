"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileSearch } from "lucide-react";
import { api, type Rfp } from "@/lib/api";
import { RfpSummaryCard } from "@/components/RfpSummaryCard";
import { RfpDetailPane } from "@/components/RfpDetailPane";
import { FilterSidebar, type FilterState } from "@/components/FilterSidebar";
import { FeedSkeleton, StatSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function StatsBar({ rfps, deadlineCount }: { rfps: Rfp[]; deadlineCount: number }) {
  const active = rfps.filter((r) => !r.deadline || new Date(r.deadline) > new Date()).length;
  const avgConf = rfps.length
    ? Math.round(rfps.reduce((s, r) => s + (r.confidenceScore ?? 0), 0) / rfps.length * 100)
    : 0;
  const stats = [
    { label: "Total RFPs",      value: rfps.length.toString() },
    { label: "Active",          value: active.toString() },
    { label: "Avg Confidence",  value: `${avgConf}%` },
    { label: "Deadline Alerts", value: deadlineCount.toString(), sub: "Due within 7 days" },
  ];
  return (
    <div className="grid grid-cols-4 gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{s.label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{s.value}</p>
          {s.sub && <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function deadlineBefore(deadline: FilterState["deadline"]): string | undefined {
  if (!deadline) return undefined;
  const d = new Date();
  if (deadline === "week")    d.setDate(d.getDate() + 7);
  if (deadline === "month")   d.setMonth(d.getMonth() + 1);
  if (deadline === "quarter") d.setMonth(d.getMonth() + 3);
  return d.toISOString();
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("rfp"));
  const [statsLoading, setStatsLoading] = useState(true);
  const [deadlineCount, setDeadlineCount] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    q:           searchParams.get("q") ?? "",
    budgetTier:  (searchParams.getAll("budgetTier") as FilterState["budgetTier"]),
    complexity:  (searchParams.get("complexity") as FilterState["complexity"]) ?? "",
    deadline:    (searchParams.get("deadline") as FilterState["deadline"]) ?? "",
    country:     searchParams.get("country") ?? "",
    techStack:   searchParams.getAll("techStack"),
  });

  const buildParams = useCallback((f: FilterState, cursor?: string) => {
    const p: Record<string, string> = {};
    if (f.q)          p.q = f.q;
    if (f.complexity) p.complexity = f.complexity;
    if (f.country)    p.country = f.country;
    if (f.deadline)   { const db = deadlineBefore(f.deadline); if (db) p.deadline_before = db; }
    if (f.budgetTier.length) p.budgetTier = f.budgetTier.join(",");
    if (f.techStack.length)  p.techStack = f.techStack.join(",");
    if (cursor)       p.cursor = cursor;
    return p;
  }, []);

  const fetchRfps = useCallback(async (f: FilterState) => {
    setLoading(true);
    try {
      const res = await api.listRfps(buildParams(f));
      setRfps(res.data);
      setNextCursor(res.nextCursor);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, [buildParams]);

  useEffect(() => { fetchRfps(filters); }, [filters, fetchRfps]);

  // deadline count from analytics
  useEffect(() => {
    api.getAnalytics().then((a) => setDeadlineCount(a.deadline_this_week)).catch(() => {});
  }, []);

  // infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;
    const obs = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && nextCursor && !loadingMore) {
        setLoadingMore(true);
        const res = await api.listRfps(buildParams(filters, nextCursor));
        setRfps((prev) => [...prev, ...res.data]);
        setNextCursor(res.nextCursor);
        setLoadingMore(false);
      }
    }, { threshold: 0.5 });
    obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [nextCursor, loadingMore, filters, buildParams]);

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    const params = new URLSearchParams();
    if (f.q) params.set("q", f.q);
    if (f.complexity) params.set("complexity", f.complexity);
    if (f.country) params.set("country", f.country);
    if (f.deadline) params.set("deadline", f.deadline);
    f.budgetTier.forEach((t) => params.append("budgetTier", t));
    f.techStack.forEach((t) => params.append("techStack", t));
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  };

  const handleSave = async (id: string) => {
    const res = await api.saveRfp(id);
    setRfps((prev) => prev.map((r) => r.id === id ? { ...r, isSaved: res.saved } : r));
  };

  return (
    <div className="flex h-full overflow-hidden">
      <FilterSidebar filters={filters} onChange={handleFilterChange} />

      {/* Center feed */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200 dark:border-slate-800">
        {statsLoading ? (
          <div className="grid grid-cols-4 gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            {[1,2,3,4].map((i) => <StatSkeleton key={i} />)}
          </div>
        ) : (
          <StatsBar rfps={rfps} deadlineCount={deadlineCount} />
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <FeedSkeleton count={6} />
          ) : rfps.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="No RFPs found"
              description="Try adjusting your filters or check back later as new opportunities are discovered."
            />
          ) : (
            <div className="p-4 space-y-3">
              {rfps.map((rfp) => (
                <RfpSummaryCard
                  key={rfp.id}
                  rfp={rfp}
                  selected={rfp.id === selectedId}
                  onClick={() => setSelectedId(rfp.id)}
                  onSave={handleSave}
                />
              ))}
              <div ref={observerRef} className="h-4" />
              {loadingMore && (
                <div className="text-center py-4 text-sm text-slate-400">Loading more...</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right detail pane */}
      <div className="w-96 shrink-0 bg-white dark:bg-slate-900">
        <RfpDetailPane rfpId={selectedId} />
      </div>
    </div>
  );
}
