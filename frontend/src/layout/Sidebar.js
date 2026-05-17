import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const APP_NAME = "Feed Hope";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const NAV = [
  { path: '/dashboard',  icon: '⊞',   label: 'Dashboard' },
  { path: '/post-food',  icon: '🎁',  label: 'Donate Food',   donorOnly: true },
  { path: '/dashboard',  icon: '📋',  label: user?.role === 'receiver' ? 'My Claims' : 'My Donations', tab: 'donations'},
  { path: '/food',       icon: '🔍',  label: 'Browse Food' },
  { path: '/impact',     icon: '📊',  label: 'Statistics' },
  { path: '/admin',      icon: '⚙️',  label: 'Admin Panel',   adminOnly: true },
  { path: '/profile',    icon: '👤',  label: 'Settings' },
];


  const handleLogout = () => { logout(); navigate('/login'); };

  const visibleNav = NAV.filter(n => {
    if (n.donorOnly && user?.role !== 'donor') return false;
    if (n.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <aside style={{ ...S.sidebar, width: collapsed ? 72 : 220 }}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z" fill="#fff"/>
            <path d="M12 8v8M8 12h8" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"/>
          </svg>
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

      {/* Nav links */}
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
      </nav>

      {/* Bottom: user card + logout */}
      <div style={S.bottom}>
  {!collapsed && (
    <div style={S.promoCard}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🤲</div>
      
      <div style={S.promoCard}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>
        </div>

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
    </div>
  )}

  <button style={S.logoutBtn} onClick={handleLogout}>
    <span style={{ fontSize: 16 }}>⬚</span>
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
  logo: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '22px 16px 18px',
    borderBottom: '1px solid #f0faf4',
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#2d6a4f,#52b788)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoName: { fontSize: 15, fontWeight: 700, color: '#1b4332', lineHeight: 1.2 },
  logoSub: { fontSize: 11, color: '#95b8a8' },
  collapseBtn: {
    marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
    color: '#95b8a8', fontSize: 18, padding: '0 4px', lineHeight: 1,
  },
  nav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
    borderRadius: 10, cursor: 'pointer', position: 'relative', transition: 'background 0.15s',
  },
  navActive: { background: '#f0faf4' },
  navIcon: { fontSize: 17, flexShrink: 0, width: 22, textAlign: 'center' },
  navLabel: { fontSize: 14, fontWeight: 500, color: '#2d6a4f' },
  activeDot: {
    position: 'absolute', right: 12, width: 6, height: 6,
    borderRadius: '50%', background: '#2d6a4f',
  },
  bottom: { padding: '10px 12px 20px', borderTop: '1px solid #f0faf4' },
  promoCard: {
    background: 'linear-gradient(135deg,#d8f3dc,#b7e4c7)', borderRadius: 14,
    padding: '18px 14px', textAlign: 'center', marginBottom: 12,
  },
  promoText: { fontSize: 13, color: '#1b4332', fontWeight: 500, margin: '0 0 12px', lineHeight: 1.4 },
  promoBtn: {
    display: 'block', background: '#2d6a4f', color: '#fff', borderRadius: 8,
    padding: '8px 0', fontSize: 13, fontWeight: 600, textDecoration: 'none',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none',
    border: 'none', padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
    color: '#888', fontSize: 14, fontWeight: 500,
  },
};

export default Sidebar;
