import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFood } from '../utils/api';
import { toast } from 'react-toastify';

const PostFood = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: 'cooked',
    quantity: '', expiryDate: '', address: '', lat: '', lng: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        toast.success('Location captured!');
      },
      () => toast.error('Could not get location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lat || !form.lng) return toast.error('Please capture your location first');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await createFood(fd);
      toast.success('Food listing posted successfully!');
      navigate('/food');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🥗 Post Food Donation</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Food Title (e.g. Rice and Dal)" value={form.title} onChange={handleChange} style={styles.input} required />
          <textarea name="description" placeholder="Describe the food (freshness, meal type, etc.)" value={form.description} onChange={handleChange} style={{ ...styles.input, height: 90, resize: 'vertical' }} />
          <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
            <option value="cooked">Cooked Food</option>
            <option value="raw">Raw Ingredients</option>
            <option value="packaged">Packaged Food</option>
            <option value="beverages">Beverages</option>
            <option value="other">Other</option>
          </select>
          <input name="quantity" placeholder="Quantity (e.g. 10 servings, 2kg)" value={form.quantity} onChange={handleChange} style={styles.input} required />
          <label style={styles.label}>Expiry / Best Before Date</label>
          <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} style={styles.input} required />
          <input name="address" placeholder="Pickup Address" value={form.address} onChange={handleChange} style={styles.input} required />

          <div style={styles.locationRow}>
            <input placeholder="Latitude" value={form.lat} readOnly style={{ ...styles.input, flex: 1, marginBottom: 0 }} />
            <input placeholder="Longitude" value={form.lng} readOnly style={{ ...styles.input, flex: 1, marginBottom: 0 }} />
            <button type="button" onClick={getLocation} style={styles.locBtn}>📍 Get Location</button>
          </div>

          <label style={{ ...styles.label, marginTop: 14 }}>Food Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={styles.input} />

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Posting...' : '📤 Post Donation'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '90vh', background: '#f1f8e9', padding: '40px 20px' },
  card: { background: '#fff', maxWidth: 560, margin: '0 auto', padding: '36px 32px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.09)' },
  title: { textAlign: 'center', color: '#2e7d32', marginBottom: 24 },
  input: { width: '100%', padding: '11px 14px', marginBottom: 14, border: '1.5px solid #c8e6c9', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' },
  label: { fontSize: 13, color: '#555', display: 'block', marginBottom: 4 },
  locationRow: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 },
  locBtn: { padding: '11px 14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 },
  btn: { width: '100%', padding: '13px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
};

export default PostFood;
