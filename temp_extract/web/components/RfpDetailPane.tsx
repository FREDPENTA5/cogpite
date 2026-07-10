"use client";

import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow, isPast, differenceInDays } from "date-fns";
import { ExternalLink, Bookmark, FileText } from "lucide-react";
import { api, type Rfp } from "@/lib/api";
import { TextSkeleton } from "@/components/ui/LoadingSkeleton";

interface RfpDetailPaneProps {
  rfpId: string | null;
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const date = new Date(deadline);
  const expired = isPast(date);
  const daysLeft = differenceInDays(date, new Date());
  const urgent = !expired && daysLeft <= 7;
  return (
    <span className={[
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
      expired ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" :
      urgent   ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" :
                 "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    ].join(" ")}>
      <span className={`h-1.5 w-1.5 rounded-full ${expired ? "bg-red-500" : urgent ? "bg-orange-500 animate-pulse" : "bg-slate-400"}`} />
      {expired ? `Expired ${formatDistanceToNow(date, { addSuffix: true })}` :
       urgent   ? `${daysLeft} days left` :
                  `Due ${formatDistanceToNow(date, { addSuffix: true })}`}
    </span>
  );
}

export function RfpDetailPane({ rfpId }: RfpDetailPaneProps) {
  const [rfp, setRfp] = useState<Rfp | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rfpId) { setRfp(null); return; }
    setLoading(true);
    api.getRfp(rfpId).then((data) => {
      setRfp(data);
      setSaved(data.isSaved ?? false);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [rfpId]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setNotesSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (rfpId) {
        await api.updateNotes(rfpId, value);
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      }
    }, 800);
  };

  const handleSave = async () => {
    if (!rfpId) return;
    const res = await api.saveRfp(rfpId);
    setSaved(res.saved);
  };

  if (!rfpId) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4">
          <FileText className="h-7 w-7 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">No RFP selected</p>
        <p className="text-xs text-slate-400 max-w-[200px]">Click any RFP from the feed to view its full details here.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-5">
        <TextSkeleton lines={2} />
        <TextSkeleton lines={1} />
        <div className="flex gap-2">
          {[64, 80, 56].map((w) => (
            <div key={w} className={`h-6 rounded-full animate-pulse bg-slate-200 dark:bg-slate-700`} style={{ width: w }} />
          ))}
        </div>
        <TextSkeleton lines={4} />
        <TextSkeleton lines={2} />
      </div>
    );
  }

  if (!rfp) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: rfp.budgetCurrency, notation: "compact", maximumFractionDigits: 1 }).format(n);

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-3">
          {rfp.title}
        </h2>
        {rfp.issuingAgency && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {rfp.issuingAgency}{rfp.country ? ` · ${rfp.country}` : ""}{rfp.region ? `, ${rfp.region}` : ""}
          </p>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-1">Budget</p>
            {rfp.budgetMin || rfp.budgetMax ? (
              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">
                {rfp.budgetMin && rfp.budgetMax ? `${fmt(rfp.budgetMin)} – ${fmt(rfp.budgetMax)}` :
                 rfp.budgetMax ? `Up to ${fmt(rfp.budgetMax)}` : `From ${fmt(rfp.budgetMin!)}`}
              </p>
            ) : (
              <p className="text-sm text-slate-400">Undisclosed</p>
            )}
            {rfp.budgetTier && (
              <span className="mt-1 inline-block text-[10px] text-slate-500 dark:text-slate-400">{rfp.budgetTier}</span>
            )}
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-1">Deadline</p>
            {rfp.deadline ? (
              <DeadlineBadge deadline={rfp.deadline} />
            ) : (
              <p className="text-sm text-slate-400">Not specified</p>
            )}
          </div>
          {rfp.complexity && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-1">Complexity</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{rfp.complexity}</p>
            </div>
          )}
          {rfp.confidenceScore !== null && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-1">AI Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${rfp.confidenceScore >= 0.8 ? "bg-emerald-500" : rfp.confidenceScore >= 0.5 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${Math.round(rfp.confidenceScore * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{Math.round(rfp.confidenceScore * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {rfp.summary && (
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-2">Summary</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{rfp.summary}</p>
          </div>
        )}

        {/* Tech stack */}
        {rfp.techStack.length > 0 && (
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {rfp.techStack.map((tech) => (
                <span key={tech} className="px-2 py-1 rounded-md text-xs font-mono font-medium bg-slate-900 text-slate-100 dark:bg-slate-700 dark:text-slate-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {rfp.categories.length > 0 && (
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-2">Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {rfp.categories.map((cat) => (
                <span key={cat} className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5">Source</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{rfp.issuingAgency ?? "Unknown agency"}</p>
          </div>
          <a
            href={(rfp as Rfp & { sourceUrl?: string }).sourceUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View source <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">Team Notes</p>
            {notesSaved && <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Saved</span>}
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add your team's notes on this opportunity..."
            rows={4}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={[
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors",
            saved
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800"
              : "bg-indigo-600 text-white hover:bg-indigo-700",
          ].join(" ")}
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved to workspace" : "Save to workspace"}
        </button>
      </div>
    </div>
  );
}
