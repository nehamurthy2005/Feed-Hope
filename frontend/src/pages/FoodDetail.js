import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById, claimFood } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import { toast } from 'react-toastify';

const FoodDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    getFoodById(id)
      .then(({ data }) => setFood(data))
      .catch(() => toast.error('Food not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClaim = async () => {
    if (!user) { navigate('/login'); return; }
    setClaiming(true);
    try {
      await claimFood(id);
      toast.success('Food claimed! Coordinate pickup with the donor.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not claim food');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <p style={{ padding: 40, textAlign: 'center' }}>Loading...</p>;
  if (!food) return <p style={{ padding: 40, textAlign: 'center' }}>Food not found.</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {food.image && <img src={food.image} alt={food.title} style={styles.img} />}
        <div style={styles.body}>
          <h2 style={styles.title}>{food.title}</h2>
          <p style={styles.desc}>{food.description}</p>
          <div style={styles.grid}>
            <div style={styles.info}><strong>Category:</strong> {food.category}</div>
            <div style={styles.info}><strong>Quantity:</strong> {food.quantity}</div>
            <div style={styles.info}><strong>Expiry:</strong> {new Date(food.expiryDate).toLocaleDateString()}</div>
            <div style={styles.info}><strong>Status:</strong> {food.status}</div>
            <div style={{ ...styles.info, gridColumn: '1/-1' }}><strong>Pickup Address:</strong> {food.address}</div>
          </div>
          {food.donor && (
            <div style={styles.donorBox}>
              <strong>Donor:</strong> {food.donor.name} &nbsp;|&nbsp; 📞 {food.donor.phone || 'N/A'} &nbsp;|&nbsp; ✉️ {food.donor.email}
            </div>
          )}
          {food.status === 'available' && user?.role !== 'donor' && (
            <button style={styles.claimBtn} onClick={handleClaim} disabled={claiming}>
              {claiming ? 'Claiming...' : '🤝 Claim This Food'}
            </button>
          )}
          {food.status !== 'available' && (
            <div style={styles.unavailable}>This listing is no longer available.</div>
          )}
        </div>
        {food.location?.lat && (
          <div style={{ padding: '0 24px 24px' }}>
            <h3 style={{ color: '#2e7d32' }}>📍 Pickup Location</h3>
            <MapView foods={[food]} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '40px 20px', background: '#f1f8e9', minHeight: '90vh' },
  card: { maxWidth: 720, margin: '0 auto', background: '#fff', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.09)', overflow: 'hidden' },
  img: { width: '100%', maxHeight: 300, objectFit: 'cover' },
  body: { padding: '24px 28px' },
  title: { fontSize: 26, color: '#1b5e20', marginBottom: 8 },
  desc: { color: '#555', marginBottom: 20, lineHeight: 1.6 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
  info: { background: '#f9fbe7', padding: '10px 14px', borderRadius: 8, fontSize: 14 },
  donorBox: { background: '#e8f5e9', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 20 },
  claimBtn: { background: '#2e7d32', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%' },
  unavailable: { background: '#fbe9e7', color: '#c62828', padding: '12px', borderRadius: 8, textAlign: 'center', fontWeight: 600 },
};

export default FoodDetail;
