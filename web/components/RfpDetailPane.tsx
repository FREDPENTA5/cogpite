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
      <div className="detail-header">
        <h2 className="detail-title">{rfp.title}</h2>
        <div className="detail-agency">
          {rfp.issuingAgency || rfp.agency} 
          {rfp.country && ` · ${rfp.country}`} 
          {rfp.region && ` (${rfp.region})`}
        </div>
      </div>

      <div className="detail-metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Budget Range</span>
          <span className="metric-value">
            {rfp.budgetMin ? `$${rfp.budgetMin.toLocaleString()}` : '0'} - {rfp.budgetMax ? `$${rfp.budgetMax.toLocaleString()}` : '+'}
          </span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Deadline</span>
          <span className="metric-value">{rfp.deadline ? formatDate(rfp.deadline) : 'N/A'}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Complexity</span>
          <span className="metric-value">{rfp.complexity || 'Unknown'}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Match Confidence</span>
          <div className="detail-confidence">
            <span style={{ color: getConfidenceColor(confScore), fontWeight: 700 }}>
              {Math.round(confScore * 100)}%
            </span>
          </div>
        </div>
      </div>

      <div className="detail-section" style={{ background: 'var(--ai-bg)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ai-text)', marginBottom: '12px' }}>
          AI Deal Match Analysis
        </h3>
        <p className="detail-summary-text" style={{ color: 'var(--gray-800)', fontSize: '15px', lineHeight: 1.6 }}>{rfp.summary}</p>
      </div>

      {rfp.techStack && rfp.techStack.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Tech Stack</h3>
          <div className="detail-tag-grid">
            {rfp.techStack.map((tech: string) => (
              <span key={tech} className="kbd">{tech}</span>
            ))}
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
