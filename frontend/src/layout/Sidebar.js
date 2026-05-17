import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyDonations } from '../utils/api';

// Lift state up: Accept collapsed and setCollapsed as props
const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeClaim, setActiveClaim] = useState(null); 

  useEffect(() => {
    if (user?.role !== 'receiver') return;
    getMyDonations('receiver')
      .then(({ data }) => {
        const active = data.find(d =>
          d.status === 'pending' || d.status === 'confirmed'
        );
        if (active?.food) {
          setActiveClaim({
            foodId: active.food._id,
            title:  active.food.title,
          });
        } else {
          setActiveClaim(null);
        }
      })
      .catch(() => setActiveClaim(null));
  }, [user]);

  const NAV = [
    { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { path: '/post-food', icon: '🎁', label: 'Donate Food', donorOnly: true },
    {
      path: '/dashboard',
      icon: '📋',
      label: user?.role === 'receiver' ? 'My Claims' : 'My Donations',
      tab: 'donations',
    },
    { path: '/food',   icon: '🔍', label: 'Browse Food' },
    { path: '/impact', icon: '📊', label: 'Statistics' },
    { path: '/admin',  icon: '⚙️', label: 'Admin Panel', adminOnly: true },
    { path: '/profile', icon: '👤', label: 'Settings' },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  const visibleNav = NAV.filter(n => {
    if (n.donorOnly && user?.role !== 'donor') return false;
    if (n.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  const activeClaimPath = activeClaim ? `/food/${activeClaim.foodId}` : null;

  return (
    <aside style={{ ...S.sidebar, width: collapsed ? 72 : 220 }}>

      {/* ── Logo ── */}
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <img src="/icons/feed-hope.jpg" alt="Feed Hope Logo" style={{ width: 50, height: 50 }} />
        </div>
        {!collapsed && (
          <div>
            <div style={S.logoName}>Feed Hope</div>
            <div style={S.logoSub}>Food Donation App</div>
          </div>
        )}
        <button style={S.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── Nav links ── */}
      <nav style={S.nav}>
        {visibleNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{ ...S.navItem, ...(active ? S.navActive : {}) }}>
                <span style={S.navIcon}>{item.icon}</span>
                {!collapsed && <span style={S.navLabel}>{item.label}</span>}
                {active && !collapsed && <div style={S.activeDot} />}
              </div>
            </Link>
          );
        })}

        {/* ── Active Claim shortcut ── */}
        {user?.role === 'receiver' && activeClaim && (
          <>
            {!collapsed && <div style={S.divider} />}
            {!collapsed && <div style={S.dividerLabel}>Active Claim</div>}

            <Link to={activeClaimPath} style={{ textDecoration: 'none' }}>
              <div style={{
                ...S.navItem,
                ...S.claimItem,
                ...(location.pathname === activeClaimPath ? S.claimActive : {}),
              }}>
                <span style={S.navIcon}>
                  <span style={S.pulseDot} />
                </span>
                {!collapsed && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.claimLabel}>📷 Show QR Code</div>
                    <div style={S.claimTitle}>{activeClaim.title}</div>
                  </div>
                )}
              </div>
            </Link>
          </>
        )}
      </nav>

      {/* ── Bottom promo + logout ── */}
      <div style={S.bottom}>
        {!collapsed && (
          <div style={S.promoCard}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🤲</div>
            <p style={S.promoText}>
              {user?.role === 'receiver'
                ? 'Find food donations near you.'
                : 'Together we can end hunger.'}
            </p>
            <Link
              to={user?.role === 'receiver' ? '/food' : '/post-food'}
              style={S.promoBtn}
            >
              {user?.role === 'receiver' ? 'Receive Now' : 'Donate Now'}
            </Link>
          </div>
        )}
        <button style={S.logoutBtn} onClick={handleLogout}>
          <span style={{ fontSize: 16 }}>➜]</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

const S = {
  sidebar: {
    height: '100vh', background: '#fff', display: 'flex', flexDirection: 'column',
    borderRight: '1px solid #e8f5e9', position: 'fixed', left: 0, top: 0,
    zIndex: 50, transition: 'width 0.25s ease', overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '22px 16px 18px', borderBottom: '1px solid #f0faf4' },
  logoIcon: { width: 40, height: 40, borderRadius: 12, background: '#f5faf7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoName: { fontSize: 15, fontWeight: 700, color: '#1b4332', lineHeight: 1.2 },
  logoSub:  { fontSize: 11, color: '#95b8a8' },
  collapseBtn: { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#95b8a8', fontSize: 18, padding: '0 4px', lineHeight: 1 },
  nav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', position: 'relative', transition: 'background 0.15s' },
  navActive: { background: '#f0faf4' },
  navIcon:   { fontSize: 17, flexShrink: 0, width: 22, textAlign: 'center' },
  navLabel:  { fontSize: 14, fontWeight: 500, color: '#2d6a4f' },
  activeDot: { position: 'absolute', right: 12, width: 6, height: 6, borderRadius: '50%', background: '#2d6a4f' },
  divider: { height: 1, background: '#f0faf4', margin: '8px 12px 4px' },
  dividerLabel: { fontSize: 10, fontWeight: 700, color: '#b7e4c7', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 4px' },
  claimItem: { background: '#f0faf4', border: '1.5px solid #b7e4c7', marginTop: 2 },
  claimActive: { background: '#e8f5e9', border: '1.5px solid #52b788' },
  claimLabel: { fontSize: 12, fontWeight: 700, color: '#2d6a4f', marginBottom: 2 },
  claimTitle: { fontSize: 11, color: '#52b788', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 },
  pulseDot: { display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#2d6a4f', boxShadow: '0 0 0 3px #b7e4c7' },
  bottom: { padding: '10px 12px 20px', borderTop: '1px solid #f0faf4' },
  promoCard: { background: 'linear-gradient(135deg,#d8f3dc,#b7e4c7)', borderRadius: 14, padding: '18px 14px', textAlign: 'center', marginBottom: 12 },
  promoText: { fontSize: 13, color: '#1b4332', fontWeight: 500, margin: '0 0 12px', lineHeight: 1.4 },
  promoBtn: { display: 'block', background: '#2d6a4f', color: '#fff', borderRadius: 8, padding: '8px 0', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', color: '#888', fontSize: 14, fontWeight: 500 },
};

if (!document.getElementById('pulse-style')) {
  const style = document.createElement('style');
  style.id = 'pulse-style';
  style.textContent = `
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0 rgba(82,183,136,0.6); }
      70%  { box-shadow: 0 0 0 6px rgba(82,183,136,0); }
      100% { box-shadow: 0 0 0 0 rgba(82,183,136,0); }
    }
  `;
  document.head.appendChild(style);
}

export default Sidebar;