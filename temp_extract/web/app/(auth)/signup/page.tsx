"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", workspaceName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())          return "Full name is required.";
    if (!form.email.includes("@"))  return "Enter a valid email address.";
    if (form.password.length < 8)   return "Password must be at least 8 characters.";
    if (!form.workspaceName.trim()) return "Workspace name is required.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const { token } = await api.signup(form);
      document.cookie = `session_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      router.push("/dashboard");
    } catch {
      setError("An account with this email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">D</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">DealScout AI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create an account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start finding RFPs in minutes</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-4">
          {[
            { label: "Full name",       field: "name"          as const, type: "text",     placeholder: "Fred Mutabazi" },
            { label: "Work email",      field: "email"         as const, type: "email",    placeholder: "fred@company.com" },
            { label: "Password",        field: "password"      as const, type: "password", placeholder: "Min. 8 characters" },
            { label: "Workspace name",  field: "workspaceName" as const, type: "text",     placeholder: "Larks Tech Hub" },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={set(field)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            By signing up you agree to our{" "}
            <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
