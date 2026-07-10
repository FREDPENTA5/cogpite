"use client";

import { useEffect, useState } from "react";
import { User, Building2, Users, Bell, CreditCard, Trash2, Check } from "lucide-react";
import { api, type UserProfile, type Workspace, type Member, type WorkspaceRole } from "@/lib/api";

type Tab = "profile" | "workspace" | "team" | "notifications" | "billing";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "profile",       label: "Profile",       icon: User },
  { key: "workspace",     label: "Workspace",     icon: Building2 },
  { key: "team",          label: "Team",          icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "billing",       label: "Billing",       icon: CreditCard },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled = false }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled}
      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500" />
  );
}

function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors">
      {saved ? <><Check className="h-3.5 w-3.5" /> Saved</> : saving ? "Saving..." : "Save changes"}
    </button>
  );
}

function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => { api.getProfile().then((p) => { setProfile(p); setName(p.name ?? ""); }); }, []);

  const handleSave = async () => {
    setSaving(true);
    await api.updateProfile({ name });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    if (newPw.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    setPwSaving(true);
    try {
      await api.changePassword({ current_password: currentPw, new_password: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch { setPwError("Current password is incorrect"); }
    finally { setPwSaving(false); }
  };

  if (!profile) return <div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />;

  return (
    <div className="space-y-8">
      <div className="space-y-4 max-w-md">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Personal information</h2>
        <Field label="Full name"><Input value={name} onChange={setName} placeholder="Your name" /></Field>
        <Field label="Email"><Input value={profile.email} disabled /></Field>
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800 max-w-md" />

      <div className="space-y-4 max-w-md">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Change password</h2>
        <Field label="Current password"><Input type="password" value={currentPw} onChange={setCurrentPw} /></Field>
        <Field label="New password"><Input type="password" value={newPw} onChange={setNewPw} /></Field>
        <Field label="Confirm new password"><Input type="password" value={confirmPw} onChange={setConfirmPw} /></Field>
        {pwError && <p className="text-xs text-red-600 dark:text-red-400">{pwError}</p>}
        <button onClick={handlePasswordChange} disabled={!currentPw || !newPw || pwSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors">
          {pwSaving ? "Updating..." : "Update password"}
        </button>
      </div>
    </div>
  );
}

function WorkspaceTab() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.getWorkspace().then((w) => { setWs(w); setName(w.name); setSlug(w.slug); }); }, []);

  const handleSave = async () => {
    setSaving(true);
    await api.updateWorkspace({ name, slug });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!ws) return <div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />;

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Workspace settings</h2>
      <Field label="Workspace name"><Input value={name} onChange={setName} /></Field>
      <Field label="Slug (URL identifier)">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 shrink-0">dealscout.app/</span>
          <Input value={slug} onChange={(v) => setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
        </div>
      </Field>
      <Field label="Plan">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ws.plan === "ENTERPRISE_HUNTER" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
          {ws.plan === "ENTERPRISE_HUNTER" ? "Enterprise Hunter" : "Local Scout"}
        </span>
      </Field>
      <SaveButton onClick={handleSave} saving={saving} saved={saved} />
    </div>
  );
}

function TeamTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.listMembers(), api.getProfile()]).then(([m, p]) => { setMembers(m); setProfile(p); });
  }, []);

  const handleInvite = async () => {
    if (!email) return;
    setError(""); setInviting(true);
    try {
      await api.inviteMember(email, role);
      setEmail(""); setRole("MEMBER");
    } catch { setError("Failed to invite. Check the email address."); }
    finally { setInviting(false); }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this team member?")) return;
    await api.removeMember(userId);
    setMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const ROLE_COLORS: Record<WorkspaceRole, string> = {
    OWNER: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    ADMIN: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    MEMBER: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Invite team member</h2>
        <div className="flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@company.com" type="email"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <select value={role} onChange={(e) => setRole(e.target.value as WorkspaceRole)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button onClick={handleInvite} disabled={!email || inviting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors">
            {inviting ? "Inviting..." : "Invite"}
          </button>
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Team members ({members.length})</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {members.map((member, i) => (
            <div key={member.id}
              className={`flex items-center gap-3 px-4 py-3 ${i < members.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                {(member.name ?? member.email)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{member.name ?? "—"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_COLORS[member.role]}`}>
                {member.role}
              </span>
              {profile?.id !== member.id && member.role !== "OWNER" && (
                <button onClick={() => handleRemove(member.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [digest, setDigest] = useState<"off" | "daily" | "weekly">("daily");
  const [alertEmails, setAlertEmails] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await api.updateProfile({ notificationPrefs: { digest, alertEmails } });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email preferences</h2>

      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Email digest frequency</p>
        <div className="space-y-2">
          {([["off","Off"],["daily","Daily summary"],["weekly","Weekly summary"]] as const).map(([v, label]) => (
            <label key={v} className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="digest" checked={digest === v} onChange={() => setDigest(v)}
                className="border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Alert match emails</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Get emailed when an alert matches a new RFP</p>
        </div>
        <button onClick={() => setAlertEmails((v) => !v)}
          className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${alertEmails ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}>
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${alertEmails ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </div>

      <SaveButton onClick={handleSave} saving={saving} saved={saved} />
    </div>
  );
}

function BillingTab() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.getWorkspace().then(setWs); }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    const { url } = await api.checkout("ENTERPRISE_HUNTER");
    window.location.href = url;
  };

  const handlePortal = async () => {
    setLoading(true);
    const { url } = await api.portal();
    window.location.href = url;
  };

  const isEnterprise = ws?.plan === "ENTERPRISE_HUNTER";

  const features = [
    { label: "RFP alerts", local: "3", enterprise: "Unlimited" },
    { label: "Team seats", local: "2", enterprise: "Unlimited" },
    { label: "Saved RFPs", local: "50", enterprise: "Unlimited" },
    { label: "API access", local: "✕", enterprise: "✓" },
    { label: "Priority support", local: "✕", enterprise: "✓" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Current plan</h2>
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${isEnterprise ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
          {isEnterprise ? "Enterprise Hunter — $499/mo" : "Local Scout — $99/mo"}
        </span>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 pb-2 pr-4">Feature</th>
            <th className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 pb-2 px-4">Local Scout</th>
            <th className="text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 pb-2 px-4">Enterprise Hunter</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {features.map((f) => (
            <tr key={f.label}>
              <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">{f.label}</td>
              <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">{f.local}</td>
              <td className="py-2.5 px-4 text-center text-indigo-600 dark:text-indigo-400 font-medium">{f.enterprise}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEnterprise ? (
        <button onClick={handlePortal} disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 rounded-lg transition-colors">
          {loading ? "Redirecting..." : "Manage subscription"}
        </button>
      ) : (
        <button onClick={handleUpgrade} disabled={loading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors">
          {loading ? "Redirecting..." : "Upgrade to Enterprise Hunter — $499/mo"}
        </button>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const CONTENT: Record<Tab, React.ReactNode> = {
    profile: <ProfileTab />, workspace: <WorkspaceTab />, team: <TeamTab />,
    notifications: <NotificationsTab />, billing: <BillingTab />,
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        </div>
        <div className="flex gap-8">
          <nav className="w-44 shrink-0 space-y-0.5">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${tab === key ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
          <div className="flex-1 min-w-0">{CONTENT[tab]}</div>
        </div>
      </div>
    </div>
  );
}
