import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFood } from '../utils/api';
import { toast } from 'react-toastify';

const CATEGORIES = ['cooked','raw','packaged','beverages','other'];
const CAT_ICONS  = { cooked:'🍲', raw:'🥕', packaged:'📦', beverages:'🧃', other:'🍱' };

const PostFood = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', category:'cooked', quantity:'', expiryDate:'', address:'', lat:'', lng:'' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleImage = e => {
    const f = e.target.files[0];
    setImage(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const getLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setForm(f=>({...f, lat:pos.coords.latitude, lng:pos.coords.longitude})); toast.success('Location captured!'); setLocLoading(false); },
      () => { toast.error('Could not get location'); setLocLoading(false); }
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.lat || !form.lng) return toast.error('Please capture your location first');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      if (image) fd.append('image', image);
      await createFood(fd);
      toast.success('Food listing posted! 🎉');
      navigate('/food');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to post');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.title}>Donate Food</h2>
        <p style={S.sub}>Fill in the details about the food you want to donate</p>
      </div>

      <div style={S.layout}>
        {/* Form */}
        <div style={S.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={S.section}>Food Details</div>
            <label style={S.label}>Food Title *</label>
            <input style={S.input} name="title" placeholder="e.g. Cooked Rice and Dal" value={form.title} onChange={handleChange} required />

            <label style={S.label}>Description</label>
            <textarea style={{...S.input, height:80, resize:'vertical'}} name="description" placeholder="Freshness, meal type, dietary notes..." value={form.description} onChange={handleChange} />

            <label style={S.label}>Category *</label>
            <div style={S.catGrid}>
              {CATEGORIES.map(c=>(
                <div key={c} style={{...S.catOpt,...(form.category===c?S.catActive:{})}} onClick={()=>setForm({...form,category:c})}>
                  <span style={{fontSize:20}}>{CAT_ICONS[c]}</span>
                  <span style={{fontSize:12, textTransform:'capitalize'}}>{c}</span>
                </div>
              ))}
            </div>

            <div style={S.twoCol}>
              <div>
                <label style={S.label}>Quantity *</label>
                <input style={S.input} name="quantity" placeholder="e.g. 10 servings, 2 kg" value={form.quantity} onChange={handleChange} required />
              </div>
              <div>
                <label style={S.label}>Expiry / Best Before *</label>
                <input style={S.input} name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required />
              </div>
            </div>

            <div style={S.section}>Pickup Location</div>
            <label style={S.label}>Full Address *</label>
            <input style={S.input} name="address" placeholder="Street, Area, City" value={form.address} onChange={handleChange} required />

            <div style={S.locationRow}>
              <input style={{...S.input, flex:1, marginBottom:0}} placeholder="Latitude" value={form.lat} readOnly />
              <input style={{...S.input, flex:1, marginBottom:0}} placeholder="Longitude" value={form.lng} readOnly />
              <button type="button" onClick={getLocation} disabled={locLoading}
                style={{...S.locBtn, background: form.lat ? '#2d6a4f' : '#52b788'}}>
                {locLoading ? '...' : '📍 Get'}
              </button>
            </div>
            {form.lat && <p style={S.locSuccess}>✅ Location captured</p>}

            <button style={S.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Posting...' : '🎁 Post Donation'}
            </button>
          </form>
        </div>

        {/* Right: image upload + tips */}
        <div style={S.rightCol}>
          <div style={S.imgCard}>
            <div style={S.section}>Food Photo</div>
            <label style={S.imgUpload}>
              {preview
                ? <img src={preview} alt="preview" style={S.imgPreview} />
                : <div style={S.imgPlaceholder}><span style={{fontSize:40}}>📷</span><span style={{fontSize:13,color:'#95b8a8',marginTop:8}}>Click to upload</span></div>
              }
              <input type="file" accept="image/*" onChange={handleImage} style={{display:'none'}} />
            </label>
            <p style={S.imgNote}>JPG, PNG up to 5MB. A good photo increases claims by 3x!</p>
          </div>
          <div style={S.tipsCard}>
            <div style={S.section}>Tips for Good Listings</div>
            {[
              '✅ Include exact quantity (weight or servings)',
              '⏰ Set an accurate expiry — expired food harms trust',
              '📍 Capture GPS location so receivers can find you easily',
              '📷 Add a photo — it increases claim rate by 3x',
              '📝 Mention if vegetarian, allergens, or reheating needed',
            ].map(t=><p key={t} style={S.tip}>{t}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const S = {
  page: { fontFamily:"'DM Sans',sans-serif" },
  header: { marginBottom:24 },
  title: { fontSize:24, fontWeight:800, color:'#1b4332', margin:'0 0 4px' },
  sub: { color:'#95b8a8', fontSize:14, margin:0 },
  layout: { display:'grid', gridTemplateColumns:'1fr 320px', gap:24, alignItems:'start' },
  formCard: { background:'#fff', borderRadius:16, padding:'28px 28px', boxShadow:'0 1px 8px rgba(45,106,79,0.06)' },
  section: { fontSize:11, fontWeight:700, color:'#52b788', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, marginTop:8 },
  label: { display:'block', fontSize:13, fontWeight:600, color:'#2d6a4f', marginBottom:6 },
  input: { width:'100%', padding:'11px 13px', border:'1.5px solid #e8f5e9', borderRadius:10, fontSize:14, marginBottom:16, boxSizing:'border-box', outline:'none', background:'#f9fefe', fontFamily:'inherit' },
  catGrid: { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:16 },
  catOpt: { border:'1.5px solid #e8f5e9', borderRadius:10, padding:'10px 4px', textAlign:'center', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, transition:'all 0.15s' },
  catActive: { background:'#e8f5e9', border:'1.5px solid #52b788', color:'#2d6a4f' },
  twoCol: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  locationRow: { display:'flex', gap:10, alignItems:'center', marginBottom:8 },
  locBtn: { padding:'11px 14px', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:600, whiteSpace:'nowrap', flexShrink:0 },
  locSuccess: { fontSize:12, color:'#52b788', margin:'0 0 16px' },
  submitBtn: { width:'100%', padding:'14px', background:'#2d6a4f', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', marginTop:8 },
  rightCol: { display:'flex', flexDirection:'column', gap:16 },
  imgCard: { background:'#fff', borderRadius:16, padding:'20px', boxShadow:'0 1px 8px rgba(45,106,79,0.06)' },
  imgUpload: { display:'block', cursor:'pointer', borderRadius:12, overflow:'hidden', border:'2px dashed #b7e4c7' },
  imgPreview: { width:'100%', height:180, objectFit:'cover', display:'block' },
  imgPlaceholder: { height:180, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5faf7' },
  imgNote: { fontSize:12, color:'#aaa', marginTop:10, lineHeight:1.5 },
  tipsCard: { background:'#f0faf4', borderRadius:16, padding:'20px' },
  tip: { fontSize:13, color:'#2d6a4f', margin:'0 0 8px', lineHeight:1.5 },
};

export default PostFood;
