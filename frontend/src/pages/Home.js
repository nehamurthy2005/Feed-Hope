import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Scroll animation
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.2 });

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div style={styles.page}>
      
      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>🌱 Reduce Food Waste. Feed More Lives.</h1>
        <p style={styles.heroSub}>
          Connect surplus food with people who need it. Every donation counts.
        </p>

        <div style={styles.heroBtns}>

          {/* 🔥 GLOW BUTTON */}
          <button
            style={styles.btnGlow}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px) scale(1.07)';
              e.target.style.boxShadow = '0 0 30px rgba(255,255,255,1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 0 20px rgba(255,255,255,0.8)';
            }}
            onClick={() => navigate('/food')}
          >
            Browse Available Food
          </button>

          {/* 🧊 JOIN BUTTON */}
          {!user && (
            <button
              style={styles.btnGlass}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.07)';
                e.target.style.background = 'rgba(255,255,255,0.35)';
                e.target.style.border = '1px solid rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.border = '1px solid rgba(255,255,255,0.3)';
              }}
              onClick={() => navigate('/register')}
            >
              Join Now — It's Free
            </button>
          )}

          {/* 🧊 DONOR BUTTON */}
          {user?.role === 'donor' && (
            <button
              style={styles.btnGlass}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.07)';
                e.target.style.background = 'rgba(255,255,255,0.35)';
                e.target.style.border = '1px solid rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.border = '1px solid rgba(255,255,255,0.3)';
              }}
              onClick={() => navigate('/post-food')}
            >
              Post Food Donation
            </button>
          )}
        </div>
      </section>

      {/* FLOATING STATS */}
      <section style={styles.stats}>
        {[
          { icon: '🍽️', label: 'Meals Saved', value: '1,200+' },
          { icon: '👥', label: 'Active Donors', value: '340+' },
          { icon: '🤝', label: 'NGOs Connected', value: '50+' },
          { icon: '📍', label: 'Cities Covered', value: '15+' },
        ].map((s, i) => (
          <div
            key={s.label}
            className="fade-in"
            style={{
              ...styles.statCard,
              animation: `float 3s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statVal}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.how}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.steps}>
          {[
            { step: '1', title: 'Sign Up', desc: 'Register as a donor or receiver.' },
            { step: '2', title: 'Post/Browse', desc: 'Post or explore food listings.' },
            { step: '3', title: 'Claim', desc: 'Claim and coordinate pickup.' },
            { step: '4', title: 'Impact', desc: 'Reduce waste and help others.' },
          ].map((s) => (
            <div key={s.step} className="fade-in" style={styles.stepCard}>
              <div style={styles.stepNum}>{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  page: { fontFamily: 'Segoe UI, sans-serif' },

  hero: {
    backgroundImage: `
      linear-gradient(rgba(46,125,50,0.7), rgba(115,171,118,0.7)),
      url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    textAlign: 'center',
    padding: '80px 20px',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  heroTitle: { fontSize: 42, fontWeight: 800 },
  heroSub: { fontSize: 18, margin: '16px 0 32px' },

  heroBtns: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  // 🔥 Glow Button
  btnGlow: {
    background: '#fff',
    color: '#2e7d32',
    border: 'none',
    padding: '14px 32px',
    borderRadius: 12,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
  },

  // 🧊 Glass Button
  btnGlass: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '14px 32px',
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    padding: '48px 32px',
    background: '#f9fbe7',
    flexWrap: 'wrap',
  },

  statCard: {
    textAlign: 'center',
    background: '#fff',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'all 0.6s ease',
  },

  statIcon: { fontSize: 32 },
  statVal: { fontSize: 26, fontWeight: 800, color: '#2e7d32' },
  statLabel: { color: '#666' },

  how: { padding: 60, textAlign: 'center' },
  sectionTitle: { fontSize: 30, marginBottom: 40 },

  steps: { display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' },

  stepCard: {
    background: '#f1f8e9',
    padding: 20,
    borderRadius: 12,
    maxWidth: 220,
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'all 0.6s ease',
  },

  stepNum: {
    background: '#2e7d32',
    color: '#fff',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px',
  },
};

export default Home;