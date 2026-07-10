"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Download, ArrowUpDown } from "lucide-react";
import { api, type SavedRfp } from "@/lib/api";
import { RfpSummaryCard } from "@/components/RfpSummaryCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

type SortKey = "saved" | "deadline" | "budget";

function exportCsv(saved: SavedRfp[]) {
  const headers = ["Title","Agency","Country","Deadline","Budget Tier","Budget Min","Budget Max","Complexity","Tech Stack","Source","Notes"];
  const rows = saved.map((s) => [
    s.rfp.title,
    s.rfp.issuingAgency ?? "",
    s.rfp.country ?? "",
    s.rfp.deadline ?? "",
    s.rfp.budgetTier ?? "",
    s.rfp.budgetMin ?? "",
    s.rfp.budgetMax ?? "",
    s.rfp.complexity ?? "",
    s.rfp.techStack.join("; "),
    (s.rfp as typeof s.rfp & { sourceUrl?: string }).sourceUrl ?? "",
    s.notes ?? "",
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "dealscout-saved-rfps.csv";
  a.click();
}

export default function SavedPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<SavedRfp[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("saved");

  useEffect(() => {
    api.listSaved().then((s) => { setSaved(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const sorted = [...saved].sort((a, b) => {
    if (sort === "deadline") {
      return (a.rfp.deadline ?? "9999") < (b.rfp.deadline ?? "9999") ? -1 : 1;
    }
    if (sort === "budget") {
      return (b.rfp.budgetMax ?? 0) - (a.rfp.budgetMax ?? 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleUnsave = async (id: string) => {
    await api.saveRfp(id);
    setSaved((prev) => prev.filter((s) => s.rfp.id !== id));
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Saved RFPs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {saved.length} saved {saved.length === 1 ? "opportunity" : "opportunities"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
              {(["saved","deadline","budget"] as SortKey[]).map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${sort === s ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                  {s === "saved" ? "Date saved" : s === "deadline" ? "Deadline" : "Budget"}
                </button>
              ))}
            </div>
            {saved.length > 0 && (
              <button onClick={() => exportCsv(saved)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved RFPs"
            description="Bookmark opportunities from the feed to track them here."
            action={{ label: "Browse feed", onClick: () => router.push("/dashboard") }}
          />
        ) : (
          <div className="space-y-3">
            {sorted.map((s) => (
              <div key={s.id}>
                <RfpSummaryCard
                  rfp={{ ...s.rfp, isSaved: true }}
                  onClick={() => router.push(`/dashboard?rfp=${s.rfp.id}`)}
                  onSave={() => handleUnsave(s.rfp.id)}
                />
                {s.notes && (
                  <div className="mt-1 ml-4 px-3 py-2 rounded-b-lg bg-amber-50 dark:bg-amber-950/30 border border-t-0 border-amber-100 dark:border-amber-900">
                    <p className="text-xs text-amber-800 dark:text-amber-300 italic line-clamp-2">{s.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
