import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { EmptyState } from './ui/EmptyState';
import { ExternalLink } from 'lucide-react';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return iso; }
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
        <LoadingSkeleton variant="multiline" lines={8} className="mt-4" />
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
        </div>
      </div>

      <div className="detail-metrics-grid">
        <div className="metric-box">
          <div className="metric-label">Budget Range</div>
          <div className="metric-value">{rfp.budgetMin ? `$${rfp.budgetMin.toLocaleString()}` : '0'} - {rfp.budgetMax ? `$${rfp.budgetMax.toLocaleString()}` : '+'}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Deadline</div>
          <div className="metric-value">{rfp.deadline ? formatDate(rfp.deadline) : 'N/A'}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Complexity</div>
          <div className="metric-value">{rfp.complexity?.toUpperCase() || 'UNKNOWN'}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Match Confidence</div>
          <div className="metric-value">{Math.round(confScore * 100)}%</div>
        </div>
      </div>

      <div className="detail-section detail-ai-section">
        <h3 className="detail-ai-title">
          AI Deal Match Analysis
        </h3>
        <p className="detail-summary-text">{rfp.summary}</p>
      </div>

      {rfp.techStack && rfp.techStack.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Tech Stack</h3>
          <div className="detail-tag-grid">
            {rfp.techStack.map((tech: string) => (
              <span key={tech} className="category-pill">{tech}</span>
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
