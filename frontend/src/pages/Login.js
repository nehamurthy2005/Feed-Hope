import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftInner}>
          <div style={S.logoRow}>
            <div style={S.logoIcon}>🤝</div>
            <div>
              <div style={S.logoName}>No Hunger</div>
              <div style={S.logoSub}>Food Donation App</div>
            </div>
          </div>
          <h1 style={S.leftTitle}>Share food,<br/>share hope.</h1>
          <p style={S.leftDesc}>Join thousands of donors and receivers making a real difference every day.</p>
          <div style={S.statsRow}>
            {[['128+','Donations'],['512','Meals Shared'],['1.2k','People Helped']].map(([v,l])=>(
              <div key={l} style={S.statChip}>
                <div style={S.statVal}>{v}</div>
                <div style={S.statLabel}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.formCard}>
          <h2 style={S.formTitle}>Welcome back</h2>
          <p style={S.formSub}>Sign in to your account</p>
          <form onSubmit={handleSubmit}>
            <label style={S.label}>Email address</label>
            <input style={S.input} type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button style={S.btn} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={S.switchText}>Don't have an account? <Link to="/register" style={S.switchLink}>Register</Link></p>
        </div>
      </div>
    </div>
  );
};

const S = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" },
  left: { flex: 1, background: 'linear-gradient(160deg,#1b4332,#2d6a4f,#52b788)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 },
  leftInner: { maxWidth: 380 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 },
  logoIcon: { fontSize: 32, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 10px' },
  logoName: { fontSize: 18, fontWeight: 700, color: '#fff' },
  logoSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  leftTitle: { fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-1px' },
  leftDesc: { fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 36 },
  statsRow: { display: 'flex', gap: 16 },
  statChip: { background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 18px', textAlign: 'center' },
  statVal: { fontSize: 20, fontWeight: 800, color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 },
  right: { width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5faf7', padding: 48 },
  formCard: { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', boxShadow: '0 4px 32px rgba(45,106,79,0.08)' },
  formTitle: { fontSize: 26, fontWeight: 800, color: '#1b4332', margin: '0 0 6px' },
  formSub: { fontSize: 14, color: '#999', marginBottom: 28 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#2d6a4f', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e8f5e9', borderRadius: 10, fontSize: 14, marginBottom: 18, boxSizing: 'border-box', outline: 'none', background: '#f9fefe', color: '#333' },
  btn: { width: '100%', padding: '13px', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' },
  switchLink: { color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' },
};

export default Login;
