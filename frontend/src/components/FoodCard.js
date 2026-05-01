import React from 'react';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ food }) => {
  const navigate = useNavigate();

  const statusColor = {
    available: '#2e7d32',
    claimed: '#f57c00',
    completed: '#555',
    expired: '#c62828',
  };

  return (
    <div style={styles.card} onClick={() => navigate(`/food/${food._id}`)}>
      {food.image ? (
        <img src={food.image} alt={food.title} style={styles.img} />
      ) : (
        <div style={styles.imgPlaceholder}>🍱</div>
      )}
      <div style={styles.body}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={styles.title}>{food.title}</h3>
          <span style={{ ...styles.badge, background: statusColor[food.status] || '#888' }}>
            {food.status}
          </span>
        </div>
        <p style={styles.meta}>📦 {food.quantity} &nbsp;|&nbsp; 🏷️ {food.category}</p>
        <p style={styles.meta}>📍 {food.address}</p>
        <p style={styles.meta}>
          ⏰ Expires: {new Date(food.expiryDate).toLocaleDateString()}
        </p>
        {food.donor && (
          <p style={styles.donor}>👤 {food.donor.name}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
    overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s',
    display: 'flex', flexDirection: 'column',
  },
  img: { width: '100%', height: 180, objectFit: 'cover' },
  imgPlaceholder: {
    height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f1f8e9', fontSize: 56,
  },
  body: { padding: '14px 16px' },
  title: { margin: '0 0 6px', fontSize: 17, color: '#1b5e20' },
  meta: { margin: '3px 0', fontSize: 13, color: '#555' },
  donor: { marginTop: 8, fontWeight: 600, color: '#388e3c', fontSize: 13 },
  badge: {
    color: '#fff', fontSize: 11, padding: '3px 9px', borderRadius: 20,
    fontWeight: 600, textTransform: 'capitalize',
  },
};

export default FoodCard;
