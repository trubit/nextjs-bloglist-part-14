"use client";

import { useEffect } from "react";
import { useNotification } from "./NotificationContext";

export default function AuthBootstrap() {
  const { showNotification } = useNotification();

  useEffect(() => {
    if (sessionStorage.getItem("login-success") === "true") {
      sessionStorage.removeItem("login-success");
      showNotification("Login successful.", "success");
    }
  }, [showNotification]);

  return null;
}
