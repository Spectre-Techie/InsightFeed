/**
 * PwaRegistrar — Registers the service worker and handles PWA install prompt.
 *
 * Client component that runs once on mount to register sw.js
 * and captures the beforeinstallprompt event for mobile browsers.
 */

'use client';

import { useEffect } from 'react';

// Store the deferred prompt globally so it can be used by other components
let deferredPrompt: Event | null = null;

export function getDeferredPrompt() {
  return deferredPrompt;
}

export default function PwaRegistrar() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[PWA] Service worker registered:', reg.scope);
          }

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('[PWA] New service worker activated');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration failed:', err);
        });
    }

    // Capture the beforeinstallprompt event (Chrome/Edge on Android)
    const handleBeforeInstall = (e: Event) => {
      // Prevent the default mini-infobar on mobile
      e.preventDefault();
      deferredPrompt = e;
      console.log('[PWA] Install prompt captured and ready');
    };

    // Listen for app installed event
    const handleInstalled = () => {
      deferredPrompt = null;
      console.log('[PWA] App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  return null;
}
