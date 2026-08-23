"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("[PWA] Service Worker registrado:", registration.scope);
          })
          .catch((err) => {
            console.error("[PWA] Falha ao registrar Service Worker:", err);
          });
      });
    }
  }, []);

  return null;
}
