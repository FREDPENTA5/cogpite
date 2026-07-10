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
        <div className="header-inner" style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Title and Search Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 className="header-title">RFP Feed</h1>
              <p className="header-subtitle">
                Latest procurement opportunities across East Africa
              </p>
            </div>
            
            {/* Right side controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="search-bar" style={{ position: 'relative', width: '320px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '10px 32px 10px 36px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none' }}
                  placeholder="Search RFPs or agencies..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--gray-100)', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', color: 'var(--gray-400)', fontWeight: 600 }}>/</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 16px', fontSize: '13px', color: 'var(--gray-600)', cursor: 'pointer', background: 'white' }}>
                <span>Sort: Default</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>

              <NotificationBell />
            </div>
          </div>

          {/* Tabs Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray-200)', paddingBottom: '16px' }}>
            <div className="tabs" style={{ display: 'flex', gap: '8px' }}>
              <button className={`btn-ghost ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All RFPs</button>
              <button className={`btn-ghost ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active</button>
              <button className={`btn-ghost ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved</button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
              {filteredRfps.length} results
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="stats-grid mb-8">
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
          </div>
        ) : (
          <div className="stats-grid mb-8">
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

        <div style={{ display: 'flex', gap: '24px', position: 'relative', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 45%', minWidth: '450px', maxWidth: '600px' }}>
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

          <div style={{ flex: '1 1 auto', position: 'sticky', top: '24px', height: 'calc(100vh - 200px)' }}>
            <div style={{ height: '100%', overflowY: 'hidden', borderRadius: '12px', border: '1px solid var(--border)', background: 'white' }}>
              <RfpDetailPane rfpId={selectedRfpId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
