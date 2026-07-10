import React from "react";

interface LoadingSkeletonProps {
  variant: "card" | "stat" | "text";
  className?: string;
}

export function LoadingSkeleton({ variant, className = "" }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton-title" style={{ height: 24, width: '60%', background: 'var(--gray-200)', borderRadius: 4, marginBottom: 12 }} />
        <div className="skeleton-line" style={{ height: 16, width: '90%', background: 'var(--gray-200)', borderRadius: 4, marginBottom: 8 }} />
        <div className="skeleton-line" style={{ height: 16, width: '70%', background: 'var(--gray-200)', borderRadius: 4, marginBottom: 16 }} />
        <div className="skeleton-footer" style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton-tag" style={{ height: 24, width: 64, background: 'var(--gray-200)', borderRadius: 12 }} />
          <div className="skeleton-tag" style={{ height: 24, width: 80, background: 'var(--gray-200)', borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div className={`skeleton-stat ${className}`} style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 8 }}>
        <div className="skeleton-stat-title" style={{ height: 12, width: 80, background: 'var(--gray-200)', borderRadius: 4, marginBottom: 8 }} />
        <div className="skeleton-stat-value" style={{ height: 28, width: 40, background: 'var(--gray-200)', borderRadius: 4 }} />
      </div>
    );
  }

  return <div className={`skeleton-line ${className}`} style={{ height: 16, width: '100%', background: 'var(--gray-200)', borderRadius: 4 }} />;
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="skeleton-line" 
          style={{ 
            height: 16, 
            width: i === lines - 1 ? '70%' : '100%', 
            background: 'var(--gray-200)', 
            borderRadius: 4 
          }} 
        />
      ))}
    </div>
  );
}
