"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  NotificationContext,
  type NotificationType,
} from "./NotificationContext";

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      if (timeout.current) clearTimeout(timeout.current);
      setNotification({ message, type });
      timeout.current = setTimeout(() => setNotification(null), 4000);
    },
    [],
  );

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  const tone =
    notification?.type === "error"
      ? "border-rose-300 bg-rose-50 text-rose-900"
      : "border-emerald-300 bg-emerald-50 text-emerald-950";

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div
          data-testid="notification"
          className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-md border px-4 py-3 shadow-lg ${tone}`}
          role={notification.type === "error" ? "alert" : "status"}
          aria-live={notification.type === "error" ? "assertive" : "polite"}
        >
          <p className="text-sm font-medium">{notification.message}</p>
          <button
            type="button"
            className="ml-auto rounded px-1 font-semibold hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Dismiss notification"
            onClick={() => {
              if (timeout.current) clearTimeout(timeout.current);
              setNotification(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
