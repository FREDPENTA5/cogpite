"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RfpSummaryCard } from "@/components/RfpSummaryCard";
import { RfpDetailPane } from "@/components/RfpDetailPane";
import { NotificationBell } from "@/components/NotificationBell";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, X } from "lucide-react";

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
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    api
      .listRfps({})
      .then((res) => setRfps((res.data ?? []) as any))
      .catch(() => setRfps([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: string) => {
    try {
      const res = await api.saveRfp(id);
      setRfps((prev) =>
        prev.map((r) => (r.id === id ? { ...r, saved: res.saved, isSaved: res.saved } : r))
      );
    } catch {
      // silently fail
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
        <div className="header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="header-title">RFP Feed</h1>
            <p className="header-subtitle">
              Latest procurement opportunities across East Africa
            </p>
          </div>
          <div>
            <NotificationBell />
          </div>
        </div>

        {loading ? (
          <div className="stats-grid mt-4">
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
            <LoadingSkeleton variant="stat" />
          </div>
        ) : (
          <div className="stats-grid mt-4">
            <div className="stat-card">
              <div className="stat-label">Total RFPs</div>
              <div className="stat-value">{totalRfps}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value">{activeRfps}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Confidence</div>
              <div className="stat-value">{avgConfidence}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">System Status</div>
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                Active
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="content">
        <div style={{ display: 'flex', gap: '24px', flexDirection: isMobileView ? 'column' : 'row', alignItems: isMobileView ? 'stretch' : 'center', marginBottom: '32px' }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: isMobileView ? '100%' : '600px', position: 'relative' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} 
            />
            <input 
              type="text" 
              className="input" 
              placeholder="Search RFPs, agencies, or keywords... (Press '/')" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '44px', height: '48px', fontSize: 'var(--text-base)', borderRadius: '12px', background: 'var(--white)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition)' }}
            />
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'var(--gray-100)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: 'var(--gray-500)', fontWeight: 600, fontFamily: 'monospace' }}>
              /
            </div>
          </div>
          
          <div className="tabs" style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn btn-ghost ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
              style={{ border: '1px solid var(--gray-200)' }}
            >
              All RFPs
            </button>
            <button 
              className={`btn btn-ghost ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
              style={{ border: '1px solid var(--gray-200)' }}
            >
              Active
            </button>
            <button 
              className={`btn btn-ghost ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
              style={{ border: '1px solid var(--gray-200)' }}
            >
              Saved
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', position: 'relative', alignItems: 'flex-start' }}>
          <div style={{ flex: isMobileView ? '1' : '0 0 45%', minWidth: isMobileView ? '0' : '450px', maxWidth: isMobileView ? '100%' : '600px' }}>
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

          {!isMobileView && (
            <div style={{ flex: '1 1 auto', position: 'sticky', top: '24px', height: 'calc(100vh - 200px)' }}>
              <div style={{ height: '100%', overflowY: 'hidden', borderRadius: '12px', border: '1px solid var(--border)', background: 'white' }}>
                <RfpDetailPane rfpId={selectedRfpId} />
              </div>
            </div>
          )}
        </div>

        {isMobileView && selectedRfpId && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--white)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <button 
              onClick={() => setSelectedRfpId(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 101,
                background: 'var(--gray-100)',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <X size={20} />
            </button>
            <div style={{ paddingTop: '60px', flex: 1, overflowY: 'auto' }}>
              <RfpDetailPane rfpId={selectedRfpId} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
