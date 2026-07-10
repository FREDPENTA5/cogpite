"use client";

import { useEffect, useState } from "react";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";
import { api, type Alert, type BudgetTier, type Complexity } from "@/lib/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlanGate } from "@/components/ui/PlanGate";

interface AlertFormData {
  name: string;
  budgetTier: BudgetTier[];
  complexity: Complexity | "";
  country: string;
  techStack: string[];
  categories: string[];
}

const EMPTY_FORM: AlertFormData = {
  name: "", budgetTier: [], complexity: "", country: "", techStack: [], categories: [],
};

function FilterSummary({ filters }: { filters: Alert["filters"] }) {
  const parts: string[] = [];
  if (filters.budgetTier) parts.push(`Budget: ${filters.budgetTier}`);
  if (filters.complexity)  parts.push(`Complexity: ${filters.complexity}`);
  if (filters.country)     parts.push(`Country: ${filters.country}`);
  if (filters.techStack?.length)  parts.push(`Tech: ${filters.techStack.join(", ")}`);
  if (filters.categories?.length) parts.push(`Categories: ${filters.categories.join(", ")}`);
  return (
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
      {parts.length ? parts.join(" · ") : "No filters — matches all RFPs"}
    </p>
  );
}

function AlertForm({ onSubmit, onCancel }: { onSubmit: (d: AlertFormData) => void; onCancel: () => void }) {
  const [form, setForm] = useState<AlertFormData>(EMPTY_FORM);
  const [techInput, setTechInput] = useState("");
  const [catInput, setCatInput] = useState("");

  const addTag = (field: "techStack" | "categories", value: string) => {
    if (!value.trim() || form[field].includes(value.trim())) return;
    setForm((f) => ({ ...f, [field]: [...f[field], value.trim()] }));
  };

  const removeTag = (field: "techStack" | "categories", value: string) =>
    setForm((f) => ({ ...f, [field]: f[field].filter((t) => t !== value) }));

  return (
    <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">New alert rule</h3>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Alert name *</label>
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Uganda cloud RFPs"
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Budget tier</label>
          <div className="space-y-1">
            {(["SMALL","MEDIUM","LARGE","ENTERPRISE"] as BudgetTier[]).map((t) => (
              <label key={t} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.budgetTier.includes(t)}
                  onChange={() => setForm((f) => ({
                    ...f,
                    budgetTier: f.budgetTier.includes(t) ? f.budgetTier.filter((x) => x !== t) : [...f.budgetTier, t]
                  }))}
                  className="rounded border-slate-300 text-indigo-600" />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Complexity</label>
          <div className="space-y-1">
            {(["LOW","MEDIUM","HIGH","CRITICAL"] as Complexity[]).map((c) => (
              <label key={c} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" name="alertComplexity" checked={form.complexity === c}
                  onChange={() => setForm((f) => ({ ...f, complexity: c }))}
                  className="border-slate-300 text-indigo-600" />
                {c}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Country</label>
        <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
          placeholder="e.g. Uganda"
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tech stack</label>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {form.techStack.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-100 dark:bg-slate-700">
              {t} <button onClick={() => removeTag("techStack", t)} className="hover:text-red-300">×</button>
            </span>
          ))}
        </div>
        <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { addTag("techStack", techInput); setTechInput(""); } }}
          placeholder="Type and press Enter"
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Categories</label>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {form.categories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {c} <button onClick={() => removeTag("categories", c)} className="hover:text-red-400">×</button>
            </span>
          ))}
        </div>
        <input value={catInput} onChange={(e) => setCatInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { addTag("categories", catInput); setCatInput(""); } }}
          placeholder="Type and press Enter"
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onSubmit(form)} disabled={!form.name.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors">
          Create alert
        </button>
        <button onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    api.listAlerts().then((a) => { setAlerts(a); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCreate = async (form: AlertFormData) => {
    const filters: Alert["filters"] = {};
    if (form.budgetTier.length === 1) filters.budgetTier = form.budgetTier[0];
    if (form.complexity) filters.complexity = form.complexity as Complexity;
    if (form.country) filters.country = form.country;
    if (form.techStack.length) filters.techStack = form.techStack;
    if (form.categories.length) filters.categories = form.categories;
    const created = await api.createAlert({ name: form.name, filters });
    setAlerts((prev) => [created, ...prev]);
    setShowForm(false);
  };

  const handleToggle = async (alert: Alert) => {
    const updated = await api.toggleAlert(alert.id, !alert.active);
    setAlerts((prev) => prev.map((a) => a.id === alert.id ? updated : a));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this alert? This cannot be undone.")) return;
    setDeletingId(id);
    await api.deleteAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(null);
  };

  const buildMatchUrl = (filters: Alert["filters"]) => {
    const p = new URLSearchParams();
    if (filters.budgetTier) p.set("budgetTier", filters.budgetTier);
    if (filters.complexity) p.set("complexity", filters.complexity);
    if (filters.country) p.set("country", filters.country);
    filters.techStack?.forEach((t) => p.append("techStack", t));
    filters.categories?.forEach((c) => p.append("categories", c));
    return `/dashboard?${p.toString()}`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Alerts</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Get notified when matching RFPs arrive.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" /> New alert
          </button>
        </div>

        <PlanGate feature="More than 3 alerts" requiredPlan="ENTERPRISE_HUNTER">
          <span />
        </PlanGate>

        {showForm && <AlertForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="h-20 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : alerts.length === 0 && !showForm ? (
          <EmptyState
            icon={Bell}
            title="No alerts yet"
            description="Create an alert to get notified when RFPs matching your criteria are discovered."
            action={{ label: "Create your first alert", onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id}
                className={`rounded-xl border p-4 transition-opacity ${deletingId === alert.id ? "opacity-50" : ""} ${alert.active ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{alert.name}</p>
                      {!alert.active && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Paused</span>
                      )}
                    </div>
                    <FilterSummary filters={alert.filters} />
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1.5 font-medium">
                      {alert.recentMatches} RFPs match
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a href={buildMatchUrl(alert.filters)} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button onClick={() => handleToggle(alert)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      {alert.active ? <ToggleRight className="h-5 w-5 text-indigo-500" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button onClick={() => handleDelete(alert.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
