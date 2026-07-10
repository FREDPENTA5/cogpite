"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { api, type BudgetTier, type Complexity, type TechStackStat } from "@/lib/api";

export interface FilterState {
  q: string;
  budgetTier: BudgetTier[];
  complexity: Complexity | "";
  deadline: "" | "week" | "month" | "quarter";
  country: string;
  techStack: string[];
}

interface SidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const BUDGET_TIERS: { value: BudgetTier; label: string }[] = [
  { value: "SMALL",      label: "< $25k" },
  { value: "MEDIUM",     label: "$25k – $250k" },
  { value: "LARGE",      label: "$250k – $2M" },
  { value: "ENTERPRISE", label: "> $2M" },
];

const COMPLEXITIES: { value: Complexity; label: string }[] = [
  { value: "LOW",      label: "Low" },
  { value: "MEDIUM",   label: "Medium" },
  { value: "HIGH",     label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const DEADLINE_OPTIONS = [
  { value: "",        label: "Any time" },
  { value: "week",    label: "This week" },
  { value: "month",   label: "This month" },
  { value: "quarter", label: "Next 3 months" },
];

export function FilterSidebar({ filters, onChange }: SidebarProps) {
  const [techOptions, setTechOptions] = useState<TechStackStat[]>([]);
  const [techInput, setTechInput] = useState("");
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const techRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.listTechStacks().then(setTechOptions).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (techRef.current && !techRef.current.contains(e.target as Node)) {
        setShowTechDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const handleSearch = (value: string) => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => update({ q: value }), 400);
  };

  const toggleBudget = (tier: BudgetTier) => {
    const next = filters.budgetTier.includes(tier)
      ? filters.budgetTier.filter((t) => t !== tier)
      : [...filters.budgetTier, tier];
    update({ budgetTier: next });
  };

  const addTech = (tech: string) => {
    if (!filters.techStack.includes(tech)) {
      update({ techStack: [...filters.techStack, tech] });
    }
    setTechInput("");
    setShowTechDropdown(false);
  };

  const removeTech = (tech: string) => update({ techStack: filters.techStack.filter((t) => t !== tech) });

  const hasFilters =
    filters.q || filters.budgetTier.length || filters.complexity ||
    filters.deadline || filters.country || filters.techStack.length;

  const clearAll = () => onChange({ q: "", budgetTier: [], complexity: "", deadline: "", country: "", techStack: [] });

  const filtered = techOptions.filter(
    (t) => t.tech.toLowerCase().includes(techInput.toLowerCase()) && !filters.techStack.includes(t.tech)
  );

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col overflow-y-auto">
      <div className="p-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            defaultValue={filters.q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search RFPs..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Budget tier */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Budget Tier</p>
          <div className="space-y-1.5">
            {BUDGET_TIERS.map((tier) => (
              <label key={tier.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.budgetTier.includes(tier.value)}
                  onChange={() => toggleBudget(tier.value)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                  {tier.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Complexity */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Complexity</p>
          <div className="space-y-1.5">
            {[{ value: "" as const, label: "All" }, ...COMPLEXITIES].map((c) => (
              <label key={c.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="complexity"
                  checked={filters.complexity === c.value}
                  onChange={() => update({ complexity: c.value as Complexity | "" })}
                  className="border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Deadline */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Deadline</p>
          <div className="relative">
            <select
              value={filters.deadline}
              onChange={(e) => update({ deadline: e.target.value as FilterState["deadline"] })}
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DEADLINE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Country */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Country</p>
          <input
            type="text"
            value={filters.country}
            onChange={(e) => update({ country: e.target.value })}
            placeholder="e.g. Uganda"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Tech stack */}
        <div ref={techRef}>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Tech Stack</p>
          {filters.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {filters.techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-900 text-slate-100 dark:bg-slate-700">
                  {tech}
                  <button onClick={() => removeTech(tech)} className="hover:text-red-300 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              value={techInput}
              onChange={(e) => { setTechInput(e.target.value); setShowTechDropdown(true); }}
              onFocus={() => setShowTechDropdown(true)}
              placeholder="Add technology..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {showTechDropdown && filtered.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg max-h-40 overflow-y-auto">
                {filtered.slice(0, 10).map((t) => (
                  <button
                    key={t.tech}
                    onClick={() => addTech(t.tech)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="font-mono">{t.tech}</span>
                    <span className="text-xs text-slate-400">{t.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="w-full py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </aside>
  );
}
