import React, { useEffect, useRef } from 'react';

/**
 * QRPickupModal
 * Shows a QR code that encodes the donation handoff details.
 * Receiver shows this to the donor at pickup — donor scans to confirm.
 * Uses the qrcode library loaded from CDN via a script tag.
 */
const QRPickupModal = ({ food, user, onClose }) => {
  const canvasRef = useRef(null);

  // QR data payload — encodes key donation info
  const qrPayload = JSON.stringify({
    foodId:    food._id,
    title:     food.title,
    receiver:  user?.name,
    receiverId: user?._id,
    timestamp: new Date().toISOString(),
    action:    'PICKUP_CONFIRM',
  });

  useEffect(() => {
    // Load qrcode.js from CDN, then render onto canvas
    const existing = document.getElementById('qrcode-script');
    const render = () => {
      if (window.QRCode && canvasRef.current) {
        // Clear previous
        canvasRef.current.innerHTML = '';
        new window.QRCode(canvasRef.current, {
          text:           qrPayload,
          width:          220,
          height:         220,
          colorDark:      '#1b4332',
          colorLight:     '#ffffff',
          correctLevel:   window.QRCode.CorrectLevel.H,
        });
      }
    };

    if (existing) {
      render();
    } else {
      const script = document.createElement('script');
      script.id  = 'qrcode-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.onload = render;
      document.head.appendChild(script);
    }
  }, [qrPayload]);

  const downloadQR = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `pickup-qr-${food._id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    // Overlay
    <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.modal}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h3 style={S.title}>Pickup QR Code</h3>
            <p style={S.sub}>Show this to the donor at pickup to confirm the handoff</p>
          </div>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Food info strip */}
        <div style={S.foodStrip}>
          <div style={S.foodIcon}>🍱</div>
          <div>
            <div style={S.foodName}>{food.title}</div>
            <div style={S.foodMeta}>{food.quantity} · {food.address}</div>
          </div>
        </div>

        {/* QR code */}
        <div style={S.qrWrap}>
          <div ref={canvasRef} style={S.qrCanvas} />
          <p style={S.qrHint}>Scan with any QR scanner app</p>
        </div>

        {/* Receiver info */}
        <div style={S.receiverRow}>
          <div style={S.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={S.receiverName}>{user?.name}</div>
            <div style={S.receiverLabel}>Receiver · {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
          </div>
        </div>

        {/* Instructions */}
        <div style={S.steps}>
          {[
            { n: '1', t: 'Arrive at pickup location',      d: 'Go to the donor\'s address shown on the listing.' },
            { n: '2', t: 'Show this QR to the donor',      d: 'Let the donor scan this code with their phone camera.' },
            { n: '3', t: 'Donor confirms handoff',         d: 'After scanning, the donor marks the donation as completed.' },
          ].map(s => (
            <div key={s.n} style={S.step}>
              <div style={S.stepNum}>{s.n}</div>
              <div>
                <div style={S.stepTitle}>{s.t}</div>
                <div style={S.stepDesc}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={S.footer}>
          <button style={S.downloadBtn} onClick={downloadQR}>⬇ Download QR</button>
          <button style={S.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  modal: {
    background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440,
    maxHeight: '90vh', overflowY: 'auto', fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '22px 24px 16px', borderBottom: '1px solid #f0faf4',
  },
  title: { fontSize: 17, fontWeight: 700, color: '#1b4332', margin: '0 0 4px' },
  sub: { fontSize: 13, color: '#95b8a8', margin: 0 },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#aaa', padding: '0 0 0 12px' },
  foodStrip: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 24px', background: '#f5faf7',
  },
  foodIcon: { fontSize: 28, background: '#e8f5e9', borderRadius: 10, padding: '6px 8px' },
  foodName: { fontSize: 14, fontWeight: 700, color: '#1b4332' },
  foodMeta: { fontSize: 12, color: '#95b8a8', marginTop: 2 },
  qrWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 16px' },
  qrCanvas: {
    padding: 16, background: '#fff', border: '2px solid #e8f5e9',
    borderRadius: 16, display: 'inline-block',
  },
  qrHint: { fontSize: 12, color: '#aaa', marginTop: 12, textAlign: 'center' },
  receiverRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 24px', background: '#f5faf7', borderTop: '1px solid #f0faf4',
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg,#2d6a4f,#52b788)',
    color: '#fff', fontWeight: 700, fontSize: 15,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  receiverName: { fontSize: 14, fontWeight: 600, color: '#1b4332' },
  receiverLabel: { fontSize: 11, color: '#95b8a8', marginTop: 2 },
  steps: { padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 },
  step: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  stepNum: {
    width: 24, height: 24, borderRadius: '50%', background: '#e8f5e9',
    color: '#2d6a4f', fontWeight: 700, fontSize: 12, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  stepTitle: { fontSize: 13, fontWeight: 600, color: '#1b4332', marginBottom: 2 },
  stepDesc: { fontSize: 12, color: '#888', lineHeight: 1.5 },
  footer: {
    display: 'flex', gap: 10, padding: '16px 24px',
    borderTop: '1px solid #f0faf4',
  },
  downloadBtn: {
    flex: 1, padding: '11px', background: '#f5faf7', color: '#2d6a4f',
    border: '1.5px solid #b7e4c7', borderRadius: 10, fontSize: 14,
    fontWeight: 600, cursor: 'pointer',
  },
  doneBtn: {
    flex: 1, padding: '11px', background: '#2d6a4f', color: '#fff',
    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
};

export default QRPickupModal;
