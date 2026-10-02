import { createContext, useContext } from "react";

export type NotificationType = "success" | "error";
export type NotificationContextValue = {
  showNotification: (message: string, type?: NotificationType) => void;
};

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
