/**
 * PwaRegistrar — Registers the service worker for PWA functionality.
 *
 * Client component that runs once on mount to register sw.js.
 * Silent — no UI. Logs to console in development.
 */

'use client';

import { useEffect } from 'react';

export default function PwaRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[PWA] Service worker registered:', reg.scope);
          }
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
