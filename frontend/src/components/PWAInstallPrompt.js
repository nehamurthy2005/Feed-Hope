import React, { useEffect, useState } from 'react';

/**
 * PWAInstallPrompt
 * Shows a native-feeling install banner when:
 * - The app is running in browser (not already installed)
 * - The browser fires the beforeinstallprompt event
 * - User hasn't dismissed it before (stored in localStorage)
 *
 * Place this inside App.js so it's always listening.
 */
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible]               = useState(false);
  const [installing, setInstalling]         = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => console.log('[SW] Registered:', reg.scope))
        .catch((err) => console.error('[SW] Registration failed:', err));
    }

    // Don't show if dismissed before
    if (localStorage.getItem('pwa-dismissed')) return;
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Small delay so it doesn't pop immediately on load
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div style={S.banner}>
      <div style={S.iconWrap}>
        <span style={{ fontSize: 28 }}>🤝</span>
      </div>
      <div style={S.text}>
        <div style={S.title}>Install No Hunger</div>
        <div style={S.sub}>Add to home screen for quick access &amp; offline use</div>
      </div>
      <div style={S.actions}>
        <button style={S.installBtn} onClick={handleInstall} disabled={installing}>
          {installing ? '...' : 'Install'}
        </button>
        <button style={S.dismissBtn} onClick={handleDismiss}>✕</button>
      </div>
    </div>
  );
};

const S = {
  banner: {
    position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
    width: 'calc(100% - 40px)', maxWidth: 500,
    background: '#fff', borderRadius: 16, padding: '14px 16px',
    boxShadow: '0 8px 32px rgba(45,106,79,0.18)',
    border: '1px solid #b7e4c7',
    display: 'flex', alignItems: 'center', gap: 12,
    zIndex: 9999, fontFamily: "'DM Sans', sans-serif",
    animation: 'slideUp 0.35s ease',
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
    background: 'linear-gradient(135deg,#d8f3dc,#b7e4c7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: 700, color: '#1b4332', marginBottom: 2 },
  sub: { fontSize: 12, color: '#95b8a8', lineHeight: 1.4 },
  actions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  installBtn: {
    background: '#2d6a4f', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: 8, fontSize: 13,
    fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  dismissBtn: {
    background: 'none', border: 'none', color: '#aaa',
    fontSize: 16, cursor: 'pointer', padding: '4px 6px',
  },
};

export default PWAInstallPrompt;
