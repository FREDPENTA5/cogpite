"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RfpSummaryCard } from "@/components/RfpSummaryCard";
import { RfpDetailPane } from "@/components/RfpDetailPane";
import { NotificationBell } from "@/components/NotificationBell";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface Rfp {
  id: string;
  title: string;
  agency?: string;
  issuingAgency?: string;
  country: string;
  region?: string;
  summary: string;
  deadline: string;
  budgetTier: string;
  complexity: string;
  techStack: string[];
  categories?: string[];
  confidence?: number;
  confidenceScore?: number;
  saved: boolean;
  isSaved?: boolean;
  sourceUrl?: string;
}

export default function DashboardPage() {
  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfpId, setSelectedRfpId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    api
      .listRfps({})
      .then((res) => setRfps((res.data ?? []).map(r => ({ ...r, saved: r.isSaved || false }))))
      .catch(() => setRfps([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: string) => {
    try {
      const res = await api.saveRfp(id);
      setRfps((prev) =>
        prev.map((r) => (r.id === id ? { ...r, saved: res.saved, isSaved: res.saved } : r))
      );
      toast(res.saved ? "RFP Saved successfully" : "RFP Unsaved");
    } catch {
      toast("Failed to save RFP", "error");
    }
  };

  const filteredRfps = rfps.filter(rfp => {
    const matchesSearch = rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (rfp.summary && rfp.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "saved") return matchesSearch && (rfp.saved || rfp.isSaved);
    if (activeTab === "active") return matchesSearch && new Date(rfp.deadline) > new Date();
    
    return matchesSearch;
  });

  const totalRfps = rfps.length;
  const activeRfps = rfps.filter(
    (r) => new Date(r.deadline) > new Date()
  ).length;
  const avgConfidence =
    totalRfps > 0
      ? Math.round(
          rfps.reduce((acc, r) => acc + (r.confidence ?? (r.confidenceScore ? r.confidenceScore * 100 : 0)), 0) / totalRfps
        )
      : 0;

  return (
    <>
      <div className="header">
        <div className="header-inner">
          <div className="dash-top-row">
            <div>
              <h1 className="header-title">RFP Feed</h1>
              <p className="header-subtitle">
                Latest procurement opportunities across East Africa
              </p>
            </div>

            <div className="dash-controls">
              <div className="search-input-wrapper">
                <Search size={14} className="search-icon" />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Search RFPs or agencies..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <kbd className="search-kbd">/</kbd>
              </div>

              <button className="sort-btn">
                <span>Sort: Default</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>

              <NotificationBell />
            </div>
          </div>

          <div className="dash-tabs-row">
            <div className="tabs">
              <button className={`btn-ghost ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All RFPs</button>
              <button className={`btn-ghost ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active</button>
              <button className={`btn-ghost ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved</button>
            </div>
            <div className="dash-results-count">
              {filteredRfps.length} results
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="stats-grid mb-4">
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
          </div>
        ) : (
          <div className="stats-grid mb-4">
            <div className="stat-card">
              <div className="stat-label">Total RFPs</div>
              <div className="stat-value">{totalRfps}</div>
              <div className="stat-change">Active in database</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value">{activeRfps}</div>
              <div className="stat-change positive">Open for bidding</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Saved</div>
              <div className="stat-value">{rfps.filter(r => r.saved || r.isSaved).length}</div>
              <div className="stat-change">Tracked opportunities</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg AI Match</div>
              <div className="stat-value">{avgConfidence}%</div>
              <div className="stat-change positive">High confidence</div>
            </div>
          </div>
        )}

        <div className="dash-split">
          <div className="dash-feed-col">
            {loading ? (
              <div className="projects-grid">
                {Array.from({ length: 5 }).map((_, i) => (
                  <LoadingSkeleton key={i} variant="card" className="mb-4" />
                ))}
              </div>
            ) : filteredRfps.length === 0 ? (
              <EmptyState 
                title="No RFPs found"
                description={searchQuery ? "Try adjusting your search filters." : "New procurement opportunities will appear here as they are discovered."}
              />
            ) : (
              <div className="projects-grid">
                {filteredRfps.map((rfp) => (
                  <RfpSummaryCard 
                    key={rfp.id} 
                    rfp={rfp} 
                    selected={selectedRfpId === rfp.id}
                    onClick={() => setSelectedRfpId(rfp.id)}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="dash-detail-col">
            <div className="dash-detail-wrapper">
              <RfpDetailPane rfpId={selectedRfpId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
