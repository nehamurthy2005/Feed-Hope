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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email" placeholder="Email Address" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input} required
          />
          <input
            type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input} required
          />
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f8e9' },
  card: { background: '#fff', padding: '40px 36px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 },
  title: { textAlign: 'center', color: '#2e7d32', marginBottom: 24 },
  input: { width: '100%', padding: '11px 14px', marginBottom: 14, border: '1.5px solid #c8e6c9', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  link: { textAlign: 'center', marginTop: 16, fontSize: 14 },
};

export default Login;
