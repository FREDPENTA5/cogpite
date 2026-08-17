import { Bookmark, Landmark } from "lucide-react";
import type { Rfp } from "@/lib/api";

interface RfpSummaryCardProps {
  rfp: any;
  selected?: boolean;
  onClick?: () => void;
  onSave?: (id: string) => void;
}

export function RfpSummaryCard({ rfp, selected = false, onClick, onSave }: RfpSummaryCardProps) {
  const isSaved = rfp.isSaved || rfp.saved;
  
  const getDeadlineText = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffTime = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    return `In ${diffDays} days`;
  };

  const getBudgetLabel = (tier: string) => {
    if (!tier) return "UNDISCLOSED";
    return tier.toUpperCase();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`rfp-feed-card ${selected ? "selected" : ""}`}
    >
      <div className="rfp-card-topbar">
        <div className="rfp-card-agency">
          <span className="rfp-card-agency-icon">
             <Landmark size={12} />
          </span>
          {(rfp.issuingAgency || rfp.agency)} {rfp.country && `· ${rfp.country}`}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(rfp.id);
          }}
          className={`btn-save-sm ${isSaved ? "saved" : ""}`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="rfp-card-body">
        <h3 className="rfp-card-title">{rfp.title}</h3>
        {rfp.summary && <p className="rfp-card-summary">{rfp.summary}</p>}
      </div>

      <div className="rfp-card-metrics">
        <div className="rfp-card-metric">
          <div className="rfp-card-metric-label">Deadline</div>
          <div className="rfp-card-metric-value">
            {rfp.deadline ? getDeadlineText(rfp.deadline) : "N/A"}
          </div>
        </div>
        
        <div className="rfp-card-metric">
          <div className="rfp-card-metric-label">Budget</div>
          <div>
             <span className="rfp-card-budget-badge">
               {getBudgetLabel(rfp.budgetTier)}
             </span>
          </div>
        </div>

        <div className="rfp-card-metric">
          <div className="rfp-card-metric-label">AI Match</div>
          <div className="rfp-card-confidence">
            <span className="rfp-card-metric-value">{Math.round(rfp.confidence ?? (rfp.confidenceScore ? rfp.confidenceScore * 100 : 0))}%</span>
            <div className="confidence-track">
              <div className="confidence-fill" style={{ width: `${Math.round(rfp.confidence ?? (rfp.confidenceScore ? rfp.confidenceScore * 100 : 0))}%`, background: 'var(--gray-400)' }} />
            </div>
          </div>
        </div>
      </div>

      {rfp.techStack && rfp.techStack.length > 0 && (
        <div className="rfp-card-tags">
          {rfp.techStack.map((tech: string) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>
      )}
    </div>
  );
}
