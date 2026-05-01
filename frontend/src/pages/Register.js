import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'donor', phone: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      toast.success('Registered successfully! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🍱 Create Account</h2>
        <form onSubmit={handleSubmit}>
          {[
            { name: 'name', placeholder: 'Full Name', type: 'text' },
            { name: 'email', placeholder: 'Email Address', type: 'email' },
            { name: 'password', placeholder: 'Password (min 6 chars)', type: 'password' },
            { name: 'phone', placeholder: 'Phone Number', type: 'text' },
            { name: 'address', placeholder: 'Your Address', type: 'text' },
          ].map((f) => (
            <input
              key={f.name} name={f.name} type={f.type}
              placeholder={f.placeholder} value={form[f.name]}
              onChange={handleChange} style={styles.input}
              required={['name', 'email', 'password'].includes(f.name)}
            />
          ))}
          <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
            <option value="donor">Donor (I want to donate food)</option>
            <option value="receiver">Receiver (I want to receive food)</option>
          </select>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f8e9' },
  card: { background: '#fff', padding: '40px 36px', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: 440 },
  title: { textAlign: 'center', color: '#2e7d32', marginBottom: 24 },
  input: { width: '100%', padding: '11px 14px', marginBottom: 14, border: '1.5px solid #c8e6c9', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '13px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  link: { textAlign: 'center', marginTop: 16, fontSize: 14 },
};

export default Register;
