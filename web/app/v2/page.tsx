"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RfpSummaryCardV2 } from "@/components/v2/RfpSummaryCardV2";
import { RfpDetailPaneV2 } from "@/components/v2/RfpDetailPaneV2";

export default function DashboardV2Page() {
  const [rfps, setRfps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfpId, setSelectedRfpId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const cardListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .listRfps({ limit: "50" })
      .then((data) => {
        const items = data.data || [];
        setRfps(items);
        if (items.length > 0) {
          // Auto-select the first one to avoid empty state, or wait for user. Let's auto-select.
          setSelectedRfpId(items[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load RFPs", err);
        toast("Failed to load feed", "error");
      })
      .finally(() => setLoading(false));
  }, [toast]);

  const handleSave = async (id: string) => {
    try {
      const res = await api.saveRfp(id);
      setRfps((prev) =>
        prev.map((r) => (r.id === id ? { ...r, saved: res.saved, isSaved: res.saved } : r))
      );
      toast(res.saved ? "Opportunity saved ✓" : "Removed from saved", res.saved ? "success" : "info");
    } catch {
      toast("Failed to save — try again", "error");
    }
  };

  const filteredRfps = rfps.filter((rfp) => {
    if (!searchQuery) return true;
    return (
      rfp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.agency?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeCount = rfps.filter(r => {
      const diff = Math.ceil((new Date(r.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return diff >= 0;
  }).length;
  
  // Find "Best Opportunity"
  const bestOpp = [...rfps].sort((a, b) => {
      const aScore = a.confidenceScore ?? a.confidence ?? 0;
      const bScore = b.confidenceScore ?? b.confidence ?? 0;
      return bScore - aScore;
  })[0];

  return (
    <>
      <div className="v2-header">
        <div className="v2-header-inner">
          <div className="v2-header-top">
            <div>
              <h1 className="v2-header-title">Deal Intelligence</h1>
              <p className="v2-header-subtitle">Find and win your next government contract</p>
            </div>
            <div className="v2-header-search-wrap">
              <Search size={16} className="v2-search-icon" />
              <input
                type="text"
                className="v2-search-input"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="v2-content">
        {/* KPI Row */}
        <div className="v2-kpi-row">
          <div className="v2-kpi-card">
            <div className="v2-kpi-val">{rfps.length}</div>
            <div className="v2-kpi-lbl">Total Scanned</div>
          </div>
          <div className="v2-kpi-card">
            <div className="v2-kpi-val" style={{ color: 'var(--emerald-600)' }}>{activeCount}</div>
            <div className="v2-kpi-lbl">Active Deals</div>
          </div>
          <div className="v2-kpi-card">
            <div className="v2-kpi-val" style={{ color: 'var(--ai-start)' }}>91%</div>
            <div className="v2-kpi-lbl">Avg Match Score</div>
          </div>
        </div>

        {/* Storytelling: Best Opportunity Highlight */}
        {bestOpp && !searchQuery && (
          <div className="v2-hot-deal-banner" onClick={() => setSelectedRfpId(bestOpp.id)}>
            <div className="v2-hot-deal-icon">🔥</div>
            <div className="v2-hot-deal-text">
              <strong>Best Match This Week:</strong> {bestOpp.title} 
              <span className="v2-hot-deal-score">
                {Math.round((bestOpp.confidenceScore ?? bestOpp.confidence ?? 0) * 100)}% Match
              </span>
            </div>
            <button className="v2-btn-review">Review Deal ➔</button>
          </div>
        )}

        {/* Main Feed layout */}
        <div 
          style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginTop: "24px" }}
          onClick={(e) => {
            if (cardListRef.current && !cardListRef.current.contains(e.target as Node)) {
              setSelectedRfpId(null);
            }
          }}
        >
          {/* Left List */}
          <div ref={cardListRef} style={{ flex: "0 0 45%", minWidth: "400px", maxWidth: "560px" }}>
            <div className="v2-list-header">
              <h3 className="v2-list-title">Opportunity Feed</h3>
              <span className="v2-list-count">{filteredRfps.length} results</span>
            </div>
            
            {loading ? (
              <div className="projects-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <LoadingSkeleton key={i} variant="card" className="mb-4" />
                ))}
              </div>
            ) : filteredRfps.length === 0 ? (
              <EmptyState title="No deals found" description="Adjust your search criteria." />
            ) : (
              <div className="v2-feed-grid">
                {filteredRfps.map((rfp) => (
                  <RfpSummaryCardV2
                    key={rfp.id}
                    rfp={rfp}
                    selected={selectedRfpId === rfp.id}
                    onClick={() => setSelectedRfpId(prev => prev === rfp.id ? null : rfp.id)}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Detail Pane */}
          <div style={{ flex: "1 1 auto", position: "sticky", top: "24px" }}>
             <RfpDetailPaneV2 rfpId={selectedRfpId} />
          </div>
        </div>
      </div>
    </>
  );
}
