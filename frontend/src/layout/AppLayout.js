import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Topbar = () => {
  const { user } = useAuth();
  return (
    <div style={S.topbar}>
      <div style={S.topbarLeft}>
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input style={S.searchInput} placeholder="Search food, donors..." />
        </div>
      </div>
      <div style={S.topbarRight}>
        <div style={S.notifBtn}>
          🔔
          <span style={S.notifDot} />
        </div>
        <div style={S.userChip}>
          <div style={S.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={S.userName}>{user?.name}</div>
            <div style={S.userRole}>{user?.role}</div>
          </div>
          <span style={{ color: '#bbb', fontSize: 12 }}>▾</span>
        </div>
      </div>
    </div>
  );
};

// 1. Destructure the layout props coming from App.jsx
const AppLayout = ({ children, collapsed, setCollapsed }) => {
  const { user } = useAuth();

  if (!user) {
    return <div style={{ fontFamily: "'DM Sans', sans-serif" }}>{children}</div>;
  }

  return (
    <div style={{ display: 'flex', fontFamily: "'DM Sans', sans-serif", background: '#f5faf7', minHeight: '100vh' }}>
      
      {/* 2. Pass control states straight down to the Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* 3. Make this margin dynamic and add a matching transition speed */}
      <div style={{ 
        marginLeft: collapsed ? 72 : 220, 
        flex: 1, 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'margin-left 0.25s ease' // Syncs beautifully with sidebar sliding
      }}>
        <Topbar />
        <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const S = {
  topbar: {
    height: 64, background: '#fff', borderBottom: '1px solid #e8f5e9',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', position: 'sticky', top: 0, zIndex: 40,
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: 8, background: '#f5faf7',
    border: '1.5px solid #e8f5e9', borderRadius: 10, padding: '8px 14px', width: 280,
  },
  searchIcon: { fontSize: 14, opacity: 0.5 },
  searchInput: { border: 'none', background: 'none', outline: 'none', fontSize: 14, color: '#333', width: '100%' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 16 },
  notifBtn: { position: 'relative', fontSize: 18, cursor: 'pointer', padding: '6px' },
  notifDot: {
    position: 'absolute', top: 4, right: 4, width: 8, height: 8,
    borderRadius: '50%', background: '#e63946', border: '2px solid #fff',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 10, background: '#f5faf7',
    border: '1.5px solid #e8f5e9', borderRadius: 12, padding: '6px 14px 6px 8px', cursor: 'pointer',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#2d6a4f,#52b788)',
    color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#1b4332', lineHeight: 1.2 },
  userRole: { fontSize: 11, color: '#95b8a8', textTransform: 'capitalize' },
};

export default AppLayout;