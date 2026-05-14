import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyDonations, getMyListings, updateDonationStatus } from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const STATUS_STYLE = {
  available: { color:'#2d6a4f', bg:'#e8f5e9' },
  claimed:   { color:'#f4a261', bg:'#fff3e0' },
  completed: { color:'#1565c0', bg:'#e3f2fd' },
  expired:   { color:'#c62828', bg:'#fbe9e7' },
  pending:   { color:'#f4a261', bg:'#fff3e0' },
  picked_up: { color:'#7c3aed', bg:'#ede7f6' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [listings, setListings]   = useState([]);
  const [tab, setTab] = useState(user?.role === 'donor' ? 'listings' : 'claims');

  useEffect(() => {
    if (user?.role === 'donor') {
      getMyListings().then(({data})=>setListings(data)).catch(console.error);
      getMyDonations('donor').then(({data})=>setDonations(data)).catch(console.error);
    } else {
      getMyDonations('receiver').then(({data})=>setDonations(data)).catch(console.error);
    }
  }, [user]);

  const markComplete = async (id) => {
    try {
      await updateDonationStatus(id, 'completed');
      toast.success('Marked as completed!');
      setDonations(prev => prev.map(d => d._id===id ? {...d, status:'completed'} : d));
    } catch { toast.error('Failed to update'); }
  };

  const TABS = user?.role === 'donor'
    ? [{ key:'listings', label:'My Listings' },{ key:'claims', label:'Donation History' }]
    : [{ key:'claims', label:'My Claims' }];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h2 style={S.greeting}>Good morning, {user?.name?.split(' ')[0]} 👋</h2>
          <p style={S.sub}>Here's your activity overview</p>
        </div>
        {user?.role === 'donor' && (
          <button style={S.postBtn} onClick={() => navigate('/post-food')}>+ Donate Food</button>
        )}
      </div>

      {/* Quick stats */}
      <div style={S.statsRow}>
        {(user?.role === 'donor' ? [
          { label:'Total Posts',    value: listings.length,                              icon:'📋', color:'#e8f5e9' },
          { label:'Active',         value: listings.filter(l=>l.status==='available').length, icon:'✅', color:'#d8f3dc' },
          { label:'Claimed',        value: listings.filter(l=>l.status==='claimed').length,   icon:'🤝', color:'#fff3e0' },
          { label:'Completed',      value: donations.filter(d=>d.status==='completed').length, icon:'🎉', color:'#e3f2fd' },
        ] : [
          { label:'Total Claims',   value: donations.length,                                    icon:'📋', color:'#e8f5e9' },
          { label:'Pending',        value: donations.filter(d=>d.status==='pending').length,    icon:'⏳', color:'#fff3e0' },
          { label:'Completed',      value: donations.filter(d=>d.status==='completed').length,  icon:'🎉', color:'#d8f3dc' },
        ]).map((s) => (
          <div key={s.label} style={{ ...S.statCard, background:s.color }}>
            <span style={S.statIcon}>{s.icon}</span>
            <span style={S.statVal}>{s.value}</span>
            <span style={S.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={S.tabRow}>
        {TABS.map(t=>(
          <button key={t.key} style={{...S.tab,...(tab===t.key?S.tabActive:{})}} onClick={()=>setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* Listings tab */}
      {tab==='listings' && (
        <div style={S.tableCard}>
          {listings.length === 0
            ? <div style={S.empty}><div style={{fontSize:48,marginBottom:12}}>📭</div><p>No listings yet. Post your first food donation!</p></div>
            : <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    {['Food','Quantity','Address','Expiry','Status',''].map(h=><th key={h} style={S.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {listings.map((f,i)=>{
                    const st = STATUS_STYLE[f.status]||STATUS_STYLE.available;
                    return (
                      <tr key={f._id} style={i%2===0?S.rowEven:{}}>
                        <td style={{...S.td, fontWeight:600, color:'#1b4332'}}>{f.title}</td>
                        <td style={S.td}>{f.quantity}</td>
                        <td style={{...S.td, color:'#999', fontSize:12}}>{f.address}</td>
                        <td style={{...S.td, color:'#888', fontSize:12}}>{new Date(f.expiryDate).toLocaleDateString()}</td>
                        <td style={S.td}><span style={{...S.badge, color:st.color, background:st.bg}}>{f.status}</span></td>
                        <td style={S.td}>
                          <button style={S.viewBtn} onClick={()=>navigate(`/food/${f._id}`)}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* Claims / history tab */}
      {tab==='claims' && (
        <div style={S.tableCard}>
          {donations.length === 0
            ? <div style={S.empty}><div style={{fontSize:48,marginBottom:12}}>📭</div><p>No donations yet.</p></div>
            : <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    {['Food', user?.role==='donor'?'Receiver':'Donor', 'Date','Status','Action'].map(h=><th key={h} style={S.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d,i)=>{
                    const st = STATUS_STYLE[d.status]||STATUS_STYLE.pending;
                    return (
                      <tr key={d._id} style={i%2===0?S.rowEven:{}}>
                        <td style={{...S.td, fontWeight:600, color:'#1b4332'}}>{d.food?.title||'—'}</td>
                        <td style={S.td}>{user?.role==='donor'?d.receiver?.name:d.donor?.name}</td>
                        <td style={{...S.td, color:'#888', fontSize:12}}>{new Date(d.createdAt).toLocaleDateString()}</td>
                        <td style={S.td}><span style={{...S.badge, color:st.color, background:st.bg}}>{d.status}</span></td>
                        <td style={S.td}>
                          {d.status==='pending' && (
                            <button style={S.completeBtn} onClick={()=>markComplete(d._id)}>Mark Done</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          }
        </div>
      )}
    </div>
  );
};

const S = {
  page: { fontFamily:"'DM Sans',sans-serif" },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 },
  greeting: { fontSize:24, fontWeight:800, color:'#1b4332', margin:'0 0 4px' },
  sub: { color:'#95b8a8', fontSize:14, margin:0 },
  postBtn: { background:'#2d6a4f', color:'#fff', border:'none', padding:'11px 22px', borderRadius:10, fontWeight:600, fontSize:14, cursor:'pointer' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14, marginBottom:24 },
  statCard: { borderRadius:14, padding:'18px 16px', textAlign:'center' },
  statIcon: { fontSize:22, display:'block', marginBottom:8 },
  statVal: { fontSize:26, fontWeight:800, color:'#1b4332', display:'block' },
  statLabel: { fontSize:12, color:'#666', marginTop:3, display:'block' },
  tabRow: { display:'flex', gap:4, marginBottom:20, borderBottom:'2px solid #f0faf4', paddingBottom:0 },
  tab: { padding:'10px 20px', border:'none', background:'none', cursor:'pointer', fontSize:14, color:'#888', fontWeight:500, borderBottom:'2px solid transparent', marginBottom:-2 },
  tabActive: { color:'#2d6a4f', borderBottom:'2px solid #2d6a4f' },
  tableCard: { background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 8px rgba(45,106,79,0.06)' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:14 },
  thead: { background:'#f5faf7' },
  th: { padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'#52b788', textTransform:'uppercase', letterSpacing:'0.05em' },
  td: { padding:'12px 16px', borderBottom:'1px solid #f5faf7', fontSize:14, color:'#333' },
  rowEven: { background:'#fdfffe' },
  badge: { padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600, textTransform:'capitalize' },
  empty: { padding:60, textAlign:'center', color:'#95b8a8' },
  viewBtn: { background:'#f0faf4', color:'#2d6a4f', border:'none', padding:'5px 12px', borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600 },
  completeBtn: { background:'#e8f5e9', color:'#2d6a4f', border:'1px solid #b7e4c7', padding:'5px 12px', borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600 },
};

export default Dashboard;
