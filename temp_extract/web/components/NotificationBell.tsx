"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { api, type Notification } from "@/lib/api";

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifications = () => {
    api.listNotifications().then(setNotifications).catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);

    // WebSocket for real-time
    const token = document.cookie.match(/session_token=([^;]+)/)?.[1];
    if (token) {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000"}/ws/notifications?token=${token}`
      );
      ws.onmessage = () => fetchNotifications();
      wsRef.current = ws;
    }

    return () => {
      clearInterval(interval);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClick = async (n: Notification) => {
    await api.markNotificationRead(n.id);
    setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
    setOpen(false);
    if (n.rfpId) router.push(`/dashboard?rfp=${n.rfpId}`);
  };

  const handleMarkAll = async () => {
    await api.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">Set up alerts to get notified of new RFPs</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={[
                    "w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                    !n.read ? "border-l-2 border-indigo-500" : "",
                  ].join(" ")}
                >
                  <p className={`text-sm ${!n.read ? "font-medium text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{n.body}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
