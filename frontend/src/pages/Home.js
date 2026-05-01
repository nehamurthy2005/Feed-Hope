import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>🌱 Reduce Food Waste. Feed More Lives.</h1>
        <p style={styles.heroSub}>
          Connect surplus food with people who need it. Every donation counts.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.btnPrimary} onClick={() => navigate('/food')}>
            Browse Available Food
          </button>
          {!user && (
            <button style={styles.btnSecondary} onClick={() => navigate('/register')}>
              Join Now — It's Free
            </button>
          )}
          {user?.role === 'donor' && (
            <button style={styles.btnSecondary} onClick={() => navigate('/post-food')}>
              Post Food Donation
            </button>
          )}
        </div>
      </section>

      {/* Stats */}
      <section style={styles.stats}>
        {[
          { icon: '🍽️', label: 'Meals Saved', value: '1,200+' },
          { icon: '👥', label: 'Active Donors', value: '340+' },
          { icon: '🤝', label: 'NGOs Connected', value: '50+' },
          { icon: '📍', label: 'Cities Covered', value: '15+' },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statVal}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={styles.how}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.steps}>
          {[
            { step: '1', title: 'Sign Up', desc: 'Register as a donor or receiver in minutes.' },
            { step: '2', title: 'Post or Browse', desc: 'Donors post surplus food. Receivers browse available listings.' },
            { step: '3', title: 'Claim & Pickup', desc: 'Receivers claim food and coordinate pickup via Google Maps.' },
            { step: '4', title: 'Make an Impact', desc: 'Track your donations and the difference you have made.' },
          ].map((s) => (
            <div key={s.step} style={styles.stepCard}>
              <div style={styles.stepNum}>{s.step}</div>
              <h3 style={{ margin: '10px 0 6px', color: '#1b5e20' }}>{s.title}</h3>
              <p style={{ margin: 0, color: '#555', fontSize: 14 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: { fontFamily: 'Segoe UI, sans-serif' },
  hero: {
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    color: '#fff', textAlign: 'center', padding: '80px 20px',
  },
  heroTitle: { fontSize: 42, margin: '0 0 16px', fontWeight: 800 },
  heroSub: { fontSize: 18, margin: '0 0 32px', opacity: 0.92 },
  heroBtns: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    background: '#fff', color: '#2e7d32', border: 'none', padding: '14px 32px',
    borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer',
  },
  btnSecondary: {
    background: 'transparent', color: '#fff', border: '2px solid #fff',
    padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer',
  },
  stats: {
    display: 'flex', justifyContent: 'center', gap: 24, padding: '48px 32px',
    background: '#f9fbe7', flexWrap: 'wrap',
  },
  statCard: {
    textAlign: 'center', background: '#fff', padding: '24px 36px',
    borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', minWidth: 140,
  },
  statIcon: { fontSize: 36 },
  statVal: { fontSize: 28, fontWeight: 800, color: '#2e7d32', margin: '8px 0 4px' },
  statLabel: { color: '#666', fontSize: 14 },
  how: { padding: '60px 32px', textAlign: 'center', background: '#fff' },
  sectionTitle: { fontSize: 30, color: '#1b5e20', marginBottom: 40 },
  steps: { display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' },
  stepCard: {
    background: '#f1f8e9', padding: '28px 24px', borderRadius: 12,
    maxWidth: 220, textAlign: 'center',
  },
  stepNum: {
    width: 44, height: 44, borderRadius: '50%', background: '#2e7d32',
    color: '#fff', fontSize: 20, fontWeight: 800, display: 'flex',
    alignItems: 'center', justifyContent: 'center', margin: '0 auto',
  },
};

export default Home;
