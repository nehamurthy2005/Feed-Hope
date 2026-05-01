import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyDonations, getMyListings, updateDonationStatus } from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [listings, setListings] = useState([]);
  const [tab, setTab] = useState(user?.role === 'donor' ? 'listings' : 'claims');

  useEffect(() => {
    if (user?.role === 'donor') {
      getMyListings().then(({ data }) => setListings(data)).catch(console.error);
      getMyDonations('donor').then(({ data }) => setDonations(data)).catch(console.error);
    } else {
      getMyDonations('receiver').then(({ data }) => setDonations(data)).catch(console.error);
    }
  }, [user]);

  const markComplete = async (id) => {
    try {
      await updateDonationStatus(id, 'completed');
      toast.success('Marked as completed!');
      setDonations((prev) =>
        prev.map((d) => d._id === id ? { ...d, status: 'completed' } : d)
      );
    } catch { toast.error('Failed to update status'); }
  };

  const statusColor = { pending: '#f57c00', confirmed: '#1976d2', completed: '#2e7d32', cancelled: '#c62828', picked_up: '#6a1b9a' };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>👋 Welcome, {user?.name}</h2>
      <p style={styles.role}>Role: <strong>{user?.role}</strong></p>

      {/* Tabs */}
      <div style={styles.tabs}>
        {user?.role === 'donor' && (
          <button style={{ ...styles.tab, ...(tab === 'listings' ? styles.tabActive : {}) }} onClick={() => setTab('listings')}>My Listings</button>
        )}
        <button style={{ ...styles.tab, ...(tab === 'claims' ? styles.tabActive : {}) }} onClick={() => setTab('claims')}>
          {user?.role === 'donor' ? 'Donation History' : 'My Claims'}
        </button>
      </div>

      {tab === 'listings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button style={styles.postBtn} onClick={() => navigate('/post-food')}>+ Post New Food</button>
          </div>
          {listings.length === 0 ? (
            <p style={styles.empty}>No listings yet. Post your first food donation!</p>
          ) : (
            <div style={styles.list}>
              {listings.map((f) => (
                <div key={f._id} style={styles.item}>
                  <div><strong>{f.title}</strong> — {f.quantity}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>📍 {f.address}</div>
                  <span style={{ ...styles.badge, background: statusColor[f.status] || '#888' }}>{f.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'claims' && (
        <div>
          {donations.length === 0 ? (
            <p style={styles.empty}>No donations yet.</p>
          ) : (
            <div style={styles.list}>
              {donations.map((d) => (
                <div key={d._id} style={styles.item}>
                  <div><strong>{d.food?.title}</strong></div>
                  <div style={{ fontSize: 13, color: '#666' }}>
                    {user?.role === 'donor' ? `Receiver: ${d.receiver?.name}` : `Donor: ${d.donor?.name}`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                    <span style={{ ...styles.badge, background: statusColor[d.status] || '#888' }}>{d.status}</span>
                    {d.status === 'pending' && (
                      <button style={styles.completeBtn} onClick={() => markComplete(d._id)}>Mark Completed</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '40px 32px', minHeight: '90vh', background: '#fafafa', maxWidth: 860, margin: '0 auto' },
  heading: { color: '#2e7d32', fontSize: 26, marginBottom: 4 },
  role: { color: '#666', marginBottom: 28 },
  tabs: { display: 'flex', gap: 10, marginBottom: 24 },
  tab: { padding: '9px 24px', borderRadius: 8, border: '1.5px solid #a5d6a7', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#2e7d32' },
  tabActive: { background: '#2e7d32', color: '#fff' },
  list: { display: 'flex', flexDirection: 'column', gap: 14 },
  item: { background: '#fff', padding: '16px 20px', borderRadius: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' },
  badge: { color: '#fff', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 },
  empty: { color: '#888', textAlign: 'center', padding: 40 },
  postBtn: { background: '#2e7d32', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  completeBtn: { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};

export default Dashboard;
