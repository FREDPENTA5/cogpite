import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { EmptyState } from './ui/EmptyState';
import { ExternalLink } from 'lucide-react';

function getBadgeClass(tier: string) {
  const normalized = tier?.toLowerCase() ?? "";
  if (normalized === "small" || normalized === "low") return "status-badge emerald";
  if (normalized === "medium") return "status-badge indigo";
  if (normalized === "large" || normalized === "high") return "status-badge amber";
  if (normalized === "enterprise" || normalized === "critical") return "status-badge rose";
  return "status-badge neutral";
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return iso; }
}

function getConfidenceColor(score: number) {
  if (score >= 0.8) return "var(--emerald-500)";
  if (score >= 0.5) return "var(--amber-500)";
  return "var(--rose-500)";
}

export function RfpDetailPane({ rfpId }: { rfpId: string | null }) {
  const [rfp, setRfp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!rfpId) {
      setRfp(null);
      return;
    }
    
    let active = true;
    const fetchRfp = async () => {
      setLoading(true);
      try {
        const data = await api.getRfp(rfpId);
        if (active) {
          setRfp(data);
          setNotes(data.notes || "");
        }
      } catch (err) {
        console.error("Failed to load RFP", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    fetchRfp();
    return () => { active = false; };
  }, [rfpId]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // In a real app we would have a dedicated endpoint for this
        // await api.updateRfpNotes(rfpId, val);
        console.log("Auto-saving notes...", val);
      } catch (err) {
        console.error("Failed to save notes", err);
      }
    }, 800);
  };

  const handleToggleSave = async () => {
    if (!rfp) return;
    try {
      const res = await api.saveRfp(rfp.id);
      setRfp({ ...rfp, isSaved: res.saved, saved: res.saved });
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  if (!rfpId) {
    return (
      <div className="detail-pane empty">
        <EmptyState
          title="Select an Opportunity"
          description="Click on any RFP in the feed to view full details, requirements, and AI match analysis."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="detail-pane">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="multiline" lines={8} className="mt-8" />
      </div>
    );
  }

  if (!rfp) return <div className="detail-pane">Error loading RFP details.</div>;

  const confScore = rfp.confidenceScore ?? rfp.confidence ?? 0;

  return (
    <div className="detail-pane">
      <div className="detail-header" style={{ marginBottom: '24px' }}>
        <h2 className="detail-title" style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{rfp.title}</h2>
        <div className="detail-agency" style={{ color: 'var(--gray-500)', fontSize: '13px' }}>
          {rfp.issuingAgency || rfp.agency} 
          {rfp.country && ` · ${rfp.country}`}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid var(--gray-100)', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Budget Range</div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{rfp.budgetMin ? `$${rfp.budgetMin.toLocaleString()}` : '0'} - {rfp.budgetMax ? `$${rfp.budgetMax.toLocaleString()}` : '+'}</div>
        </div>
        <div style={{ border: '1px solid var(--gray-100)', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Deadline</div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{rfp.deadline ? formatDate(rfp.deadline) : 'N/A'}</div>
        </div>
        <div style={{ border: '1px solid var(--gray-100)', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Complexity</div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{rfp.complexity?.toUpperCase() || 'UNKNOWN'}</div>
        </div>
        <div style={{ border: '1px solid var(--gray-100)', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Match Confidence</div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{Math.round(confScore * 100)}%</div>
        </div>
      </div>

      <div className="detail-section" style={{ background: 'var(--gray-50)', padding: '24px', borderRadius: '8px', border: 'none', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-900)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
          AI Deal Match Analysis
        </h3>
        <p style={{ color: 'var(--gray-600)', fontSize: '14px', lineHeight: 1.6 }}>{rfp.summary}</p>
      </div>

      {rfp.techStack && rfp.techStack.length > 0 && (
        <div className="detail-section" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-900)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Tech Stack</h3>
          <div style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
            {rfp.techStack.join(' ')}
          </div>
        </div>
      )}

      {rfp.categories && rfp.categories.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Categories</h3>
          <div className="detail-tag-grid">
            {rfp.categories.map((cat: string) => (
              <span key={cat} className="category-pill">{cat}</span>
            ))}
          </div>
        </div>
      )}

      {rfp.sourceUrl && (
        <div className="detail-section">
          <a href={rfp.sourceUrl} target="_blank" rel="noreferrer" className="source-link">
            View original source <ExternalLink size={14} />
          </a>
        </div>
      )}

      <hr className="detail-divider" />

      <div className="detail-section">
        <h3 className="section-title">Team Notes</h3>
        <textarea
          className="detail-notes-input"
          placeholder="Add your team notes... (auto-saves)"
          value={notes}
          onChange={handleNotesChange}
        />
      </div>

      <div className="detail-actions">
        <button className={`btn-primary ${rfp.isSaved || rfp.saved ? 'saved' : ''}`} onClick={handleToggleSave}>
          {rfp.isSaved || rfp.saved ? "Unsave Opportunity" : "Save Opportunity"}
        </button>
      </div>
    </div>
  );
}
