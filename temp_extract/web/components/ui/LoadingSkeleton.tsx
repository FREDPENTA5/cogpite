"use client";

interface SkeletonProps {
  className?: string;
}

function Bone({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <Bone className="h-4 w-3/4" />
          <Bone className="h-3 w-1/2" />
        </div>
        <Bone className="h-6 w-6 rounded-md ml-3" />
      </div>
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-5/6" />
      <div className="flex gap-2">
        <Bone className="h-5 w-16 rounded-md" />
        <Bone className="h-5 w-20 rounded-md" />
        <Bone className="h-5 w-14 rounded-md" />
      </div>
      <Bone className="h-1.5 w-full rounded-full" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-2">
      <Bone className="h-3 w-24" />
      <Bone className="h-7 w-16" />
    </div>
  );
}

export function TextSkeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Bone key={i} className={`h-3 ${i === lines - 1 ? "w-4/5" : "w-full"}`} />
      ))}
    </div>
  );
}

export function FeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
