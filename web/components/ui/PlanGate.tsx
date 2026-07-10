"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type PlanTier } from "@/lib/api";
import { Zap } from "lucide-react";

interface PlanGateProps {
  feature: string;
  requiredPlan: PlanTier;
  children: React.ReactNode;
}

export function PlanGate({ feature, requiredPlan, children }: PlanGateProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanTier | null>(null);

  useEffect(() => {
    api.getWorkspace().then((w) => setPlan(w.plan));
  }, []);

  if (plan === null) return null;

  const hasAccess =
    plan === "ENTERPRISE_HUNTER" || requiredPlan === "LOCAL_SCOUT";

  if (hasAccess) return <>{children}</>;

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3">
      <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-1.5 shrink-0">
        <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
          {feature} requires Enterprise Hunter
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
          Upgrade to unlock unlimited alerts, seats, and API access.
        </p>
      </div>
      <button
        onClick={() => router.push("/billing")}
        className="shrink-0 text-xs font-medium px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
      >
        Upgrade
      </button>
    </div>
  );
}
