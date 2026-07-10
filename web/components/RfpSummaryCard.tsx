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
      style={{
        background: "white",
        border: "1px solid var(--gray-200)",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: selected ? "0 4px 24px rgba(0, 0, 0, 0.05)" : "none",
        borderColor: selected ? "var(--gray-300)" : "var(--gray-200)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gray-500)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", background: "var(--gray-100)", borderRadius: "4px" }}>
             <Landmark size={12} color="var(--gray-600)" />
          </span>
          {rfp.agency} {rfp.country && `· ${rfp.country}`}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(rfp.id);
          }}
          style={{
            background: "white",
            border: "1px solid var(--gray-200)",
            borderRadius: "6px",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--gray-700)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--gray-900)", marginBottom: "8px", lineHeight: 1.3 }}>{rfp.title}</h3>
        {rfp.summary && <p style={{ fontSize: "13px", color: "var(--gray-500)", lineHeight: 1.5 }}>{rfp.summary}</p>}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {/* DEADLINE */}
        <div style={{ flex: 1, border: "1px solid var(--gray-100)", borderRadius: "8px", padding: "12px" }}>
          <div style={{ fontSize: "10px", color: "var(--gray-500)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Deadline</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--gray-900)" }}>
            {rfp.deadline ? getDeadlineText(rfp.deadline) : "N/A"}
          </div>
        </div>
        
        {/* BUDGET */}
        <div style={{ flex: 1, border: "1px solid var(--gray-100)", borderRadius: "8px", padding: "12px" }}>
          <div style={{ fontSize: "10px", color: "var(--gray-500)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Budget</div>
          <div>
             <span style={{ background: "black", color: "white", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.05em" }}>
               {getBudgetLabel(rfp.budgetTier)}
             </span>
          </div>
        </div>

        {/* AI MATCH */}
        <div style={{ flex: 1, border: "1px solid var(--gray-100)", borderRadius: "8px", padding: "12px" }}>
          <div style={{ fontSize: "10px", color: "var(--gray-500)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>AI Match</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--gray-900)" }}>{rfp.confidenceScore}%</span>
            <div style={{ flex: 1, height: "4px", background: "var(--gray-200)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: `${rfp.confidenceScore}%`, height: "100%", background: "var(--gray-400)" }} />
            </div>
          </div>
        </div>
      </div>

      {rfp.techStack && rfp.techStack.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {rfp.techStack.map((tech: string) => (
            <span key={tech} style={{ border: "1px solid var(--gray-200)", background: "white", color: "var(--gray-600)", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 500 }}>
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
