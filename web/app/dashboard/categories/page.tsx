"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Monitor, Heart, GraduationCap, Building2, Banknote,
  Sprout, Landmark, Shield, MoreHorizontal,
} from "lucide-react";
import { api, type CategoryStat } from "@/lib/api";

const SECTOR_MAP: Record<string, { label: string; icon: React.ElementType; keywords: string[] }> = {
  ICT:           { label: "ICT & Software",      icon: Monitor,     keywords: ["ict","software","digital","technology","cyber","cloud","data","network","system","tech"] },
  Health:        { label: "Health",               icon: Heart,       keywords: ["health","medical","hospital","clinic","pharma","drug"] },
  Education:     { label: "Education",            icon: GraduationCap, keywords: ["education","school","university","learning","training","academic"] },
  Infrastructure:{ label: "Infrastructure",       icon: Building2,   keywords: ["infrastructure","construction","road","bridge","water","energy","power"] },
  Finance:       { label: "Finance",              icon: Banknote,    keywords: ["finance","banking","insurance","tax","audit","accounting","payment","fintech"] },
  Agriculture:   { label: "Agriculture",          icon: Sprout,      keywords: ["agriculture","farming","food","crop","livestock","irrigation"] },
  Government:    { label: "Government Services",  icon: Landmark,    keywords: ["government","public","ministry","municipality","department","e-government","citizen"] },
  Defence:       { label: "Defence & Security",   icon: Shield,      keywords: ["defence","defense","security","military","police","border"] },
  Other:         { label: "Other",                icon: MoreHorizontal, keywords: [] },
};

function matchSector(category: string): string {
  const lower = category.toLowerCase();
  for (const [key, { keywords }] of Object.entries(SECTOR_MAP)) {
    if (key === "Other") continue;
    if (keywords.some((kw) => lower.includes(kw))) return key;
  }
  return "Other";
}

interface SectorData {
  key: string;
  label: string;
  icon: React.ElementType;
  count: number;
  categories: string[];
}

export default function CategoriesPage() {
  const router = useRouter();
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCategories().then((s) => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // Group raw categories into sectors
  const sectors = Object.entries(SECTOR_MAP).reduce<Record<string, SectorData>>((acc, [key, def]) => {
    acc[key] = { key, label: def.label, icon: def.icon, count: 0, categories: [] };
    return acc;
  }, {});

  for (const stat of stats) {
    const sector = matchSector(stat.category);
    sectors[sector].count += stat.count;
    sectors[sector].categories.push(stat.category);
  }

  const sectorList = Object.values(sectors).filter((s) => s.count > 0).sort((a, b) => b.count - a.count);
  const topStats = stats.slice(0, 30);

  const navigateToSector = (sector: SectorData) => {
    const cats = sector.categories.slice(0, 3).join(",");
    router.push(`/dashboard?categories=${encodeURIComponent(cats)}`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 pt-[76px] md:pt-8 pb-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Browse by Category</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Explore procurement opportunities by sector.</p>
        </div>

        {/* Sector grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="h-32 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorList.map((sector) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.key}
                  onClick={() => navigateToSector(sector)}
                  className="group text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950 p-2.5 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
                      <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{sector.count}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{sector.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {sector.categories.slice(0, 3).join(", ")}{sector.categories.length > 3 ? " +more" : ""}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium group-hover:underline">
                    View RFPs →
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* All categories as pills */}
        {topStats.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">All categories</h2>
            <div className="flex flex-wrap gap-2">
              {topStats.map((stat) => (
                <button
                  key={stat.category}
                  onClick={() => router.push(`/dashboard?categories=${encodeURIComponent(stat.category)}`)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  {stat.category}
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                    {stat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
