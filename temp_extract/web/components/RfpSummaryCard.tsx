"use client";

import { formatDistanceToNow, isPast, differenceInDays } from "date-fns";
import { Bookmark } from "lucide-react";
import type { Rfp, BudgetTier, Complexity } from "@/lib/api";

interface RfpSummaryCardProps {
  rfp: Rfp;
  selected?: boolean;
  onClick?: () => void;
  onSave?: (id: string) => void;
}

const BUDGET_CONFIG: Record<BudgetTier, { label: string; className: string }> = {
  SMALL:      { label: "< $25k",   className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  MEDIUM:     { label: "$25–250k", className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  LARGE:      { label: "$250k–2M", className: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  ENTERPRISE: { label: "> $2M",    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
};

const COMPLEXITY_CONFIG: Record<Complexity, { label: string; dot: string }> = {
  LOW:      { label: "Low",      dot: "bg-emerald-500" },
  MEDIUM:   { label: "Medium",   dot: "bg-yellow-400" },
  HIGH:     { label: "High",     dot: "bg-orange-500" },
  CRITICAL: { label: "Critical", dot: "bg-red-500" },
};

function DeadlinePill({ deadline }: { deadline: string }) {
  const date = new Date(deadline);
  const expired = isPast(date);
  const daysLeft = differenceInDays(date, new Date());
  const urgent = !expired && daysLeft <= 7;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        expired ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" :
        urgent   ? "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" :
                   "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
      ].join(" ")}
    >
      <span className={[
        "h-1.5 w-1.5 rounded-full",
        expired ? "bg-red-500" :
        urgent   ? "bg-orange-500 animate-pulse" :
                   "bg-slate-400",
      ].join(" ")} />
      {expired ? "Expired" : urgent ? `${daysLeft}d left` : formatDistanceToNow(date, { addSuffix: true })}
    </span>
  );
}

function BudgetDisplay({ min, max, currency }: { min: number | null; max: number | null; currency: string }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(n);
  if (!min && !max) return <span className="text-slate-400 text-xs">Budget undisclosed</span>;
  if (min && max)   return <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">{fmt(min)} – {fmt(max)}</span>;
  if (max)          return <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">Up to {fmt(max)}</span>;
  return                   <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">From {fmt(min!)}</span>;
}

export function RfpSummaryCard({ rfp, selected = false, onClick, onSave }: RfpSummaryCardProps) {
  const budget = rfp.budgetTier ? BUDGET_CONFIG[rfp.budgetTier] : null;
  const complexity = rfp.complexity ? COMPLEXITY_CONFIG[rfp.complexity] : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-selected={selected}
      className={[
        "group relative flex flex-col gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-indigo-500",
        selected
          ? "border-indigo-400/60 bg-indigo-50/40 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/20"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800/50",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
            {rfp.title}
          </p>
          {rfp.issuingAgency && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              {rfp.issuingAgency}{rfp.country ? ` · ${rfp.country}` : ""}
            </p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSave?.(rfp.id); }}
          aria-label={rfp.isSaved ? "Unsave RFP" : "Save RFP"}
          className={[
            "shrink-0 rounded-lg p-1.5 transition-colors",
            rfp.isSaved
              ? "text-indigo-500 hover:text-indigo-400"
              : "text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400",
          ].join(" ")}
        >
          <Bookmark className="h-4 w-4" fill={rfp.isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Summary */}
      {rfp.summary && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {rfp.summary}
        </p>
      )}

      {/* Metrics row */}
      <div className="flex flex-wrap items-center gap-2">
        {budget && (
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-black/5 ${budget.className}`}>
            {budget.label}
          </span>
        )}
        {complexity && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className={`h-2 w-2 rounded-full ${complexity.dot}`} />
            {complexity.label}
          </span>
        )}
        <BudgetDisplay min={rfp.budgetMin} max={rfp.budgetMax} currency={rfp.budgetCurrency} />
        {rfp.deadline && (
          <div className="ml-auto">
            <DeadlinePill deadline={rfp.deadline} />
          </div>
        )}
      </div>

      {/* Tech stack */}
      {rfp.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {rfp.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-mono font-medium bg-slate-900 text-slate-100 dark:bg-slate-700 dark:text-slate-200"
            >
              {tech}
            </span>
          ))}
          {rfp.techStack.length > 5 && (
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              +{rfp.techStack.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Confidence bar */}
      {rfp.confidenceScore !== null && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={[
                "h-full rounded-full transition-all",
                rfp.confidenceScore >= 0.8 ? "bg-emerald-500" :
                rfp.confidenceScore >= 0.5 ? "bg-yellow-400" : "bg-red-400",
              ].join(" ")}
              style={{ width: `${Math.round(rfp.confidenceScore * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {Math.round(rfp.confidenceScore * 100)}% confidence
          </span>
        </div>
      )}

      {/* Footer */}
      {rfp.publishedAt && (
        <p className="text-[11px] text-slate-400 dark:text-slate-600">
          Published {formatDistanceToNow(new Date(rfp.publishedAt), { addSuffix: true })}
        </p>
      )}
    </div>
  );
}
