import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'donor', phone:'', address:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data); toast.success('Welcome! 🎉'); navigate('/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftInner}>
          <div style={S.logo}>🤝 <span style={S.logoTxt}>No Hunger</span></div>
          <h1 style={S.title}>Start making<br/>a difference.</h1>
          <p style={S.desc}>Create an account and join our community of food donors and receivers fighting hunger together.</p>
          <div style={S.roleCards}>
            {[
              { r:'donor', icon:'🎁', t:'I want to Donate', d:'Share surplus food with those in need' },
              { r:'receiver', icon:'🏠', t:'I want to Receive', d:'Get food for my community or NGO' },
            ].map(({r,icon,t,d}) => (
              <div key={r} style={{ ...S.roleCard, ...(form.role===r ? S.roleActive : {}) }}
                onClick={() => setForm({...form, role:r})}>
                <div style={S.roleIcon}>{icon}</div>
                <div style={S.roleTitle}>{t}</div>
                <div style={S.roleDesc}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <h2 style={S.cardTitle}>Create Account</h2>
          <p style={S.cardSub}>Fill in your details to get started</p>
          <form onSubmit={handleSubmit}>
            {[
              {n:'name', p:'Full Name', t:'text', req:true},
              {n:'email', p:'Email Address', t:'email', req:true},
              {n:'password', p:'Password (min 6 chars)', t:'password', req:true},
              {n:'phone', p:'Phone Number', t:'text'},
              {n:'address', p:'Your Address', t:'text'},
            ].map(({n,p,t,req}) => (
              <div key={n}>
                <label style={S.label}>{p}{req&&<span style={{color:'#e63946'}}>*</span>}</label>
                <input style={S.input} name={n} type={t} placeholder={p} value={form[n]}
                  onChange={e=>setForm({...form,[n]:e.target.value})} required={req} />
              </div>
            ))}
            <div style={S.roleToggle}>
              {['donor','receiver'].map(r=>(
                <button type="button" key={r} style={{...S.roleBtn,...(form.role===r?S.roleBtnActive:{})}}
                  onClick={()=>setForm({...form,role:r})}>
                  {r==='donor'?'🎁':'🏠'} {r.charAt(0).toUpperCase()+r.slice(1)}
                </button>
              ))}
            </div>
            <button style={S.btn} disabled={loading}>{loading?'Creating...':'Create Account →'}</button>
          </form>
          <p style={S.switch}>Already have an account? <Link to="/login" style={S.switchLink}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

const S = {
  page: { display:'flex', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" },
  left: { flex:1, background:'linear-gradient(160deg,#1b4332,#2d6a4f)', display:'flex', alignItems:'center', justifyContent:'center', padding:48 },
  leftInner: { maxWidth:380 },
  logo: { display:'flex', alignItems:'center', gap:8, fontSize:22, fontWeight:700, color:'#fff', marginBottom:36 },
  logoTxt: { fontSize:18 },
  title: { fontSize:40, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:16, letterSpacing:'-1px' },
  desc: { fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:32 },
  roleCards: { display:'flex', flexDirection:'column', gap:12 },
  roleCard: { background:'rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px', cursor:'pointer', border:'1.5px solid transparent', transition:'all 0.15s' },
  roleActive: { background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.4)' },
  roleIcon: { fontSize:22, marginBottom:6 },
  roleTitle: { fontSize:14, fontWeight:700, color:'#fff', marginBottom:3 },
  roleDesc: { fontSize:12, color:'rgba(255,255,255,0.6)' },
  right: { width:500, display:'flex', alignItems:'center', justifyContent:'center', background:'#f5faf7', padding:'32px 40px', overflowY:'auto' },
  card: { background:'#fff', borderRadius:20, padding:'36px 32px', width:'100%', boxShadow:'0 4px 32px rgba(45,106,79,0.08)' },
  cardTitle: { fontSize:24, fontWeight:800, color:'#1b4332', margin:'0 0 6px' },
  cardSub: { fontSize:14, color:'#999', marginBottom:24 },
  label: { display:'block', fontSize:12, fontWeight:600, color:'#2d6a4f', marginBottom:5 },
  input: { width:'100%', padding:'11px 13px', border:'1.5px solid #e8f5e9', borderRadius:9, fontSize:14, marginBottom:14, boxSizing:'border-box', outline:'none', background:'#f9fefe' },
  roleToggle: { display:'flex', gap:10, marginBottom:18 },
  roleBtn: { flex:1, padding:'10px', border:'1.5px solid #e8f5e9', borderRadius:9, background:'#f9fefe', cursor:'pointer', fontSize:13, color:'#555', fontWeight:500 },
  roleBtnActive: { background:'#2d6a4f', color:'#fff', border:'1.5px solid #2d6a4f' },
  btn: { width:'100%', padding:'13px', background:'#2d6a4f', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' },
  switch: { textAlign:'center', marginTop:18, fontSize:13, color:'#888' },
  switchLink: { color:'#2d6a4f', fontWeight:600, textDecoration:'none' },
};

export default Register;
