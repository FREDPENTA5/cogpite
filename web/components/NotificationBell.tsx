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
    <div className="notif-wrapper" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="notif-btn"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="notif-badge">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span className="notif-dropdown-title">Notifications</span>
            {unread > 0 && (
              <button onClick={handleMarkAll} className="notif-mark-all">Mark all read</button>
            )}
          </div>

          <div className="notif-dropdown-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={20} />
                <p>No notifications yet</p>
                <span>Set up alerts to get notified of new RFPs</span>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`notif-item ${!n.read ? "unread" : ""}`}
                >
                  <p className="notif-item-title">{n.title}</p>
                  {n.body && <p className="notif-item-body">{n.body}</p>}
                  <p className="notif-item-time">
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
