import React from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS = {
  available: { color:'#2d6a4f', bg:'#e8f5e9' },
  claimed:   { color:'#f4a261', bg:'#fff3e0' },
  completed: { color:'#1565c0', bg:'#e3f2fd' },
  expired:   { color:'#c62828', bg:'#fbe9e7' },
};

const CATICON = { cooked:'🍲', raw:'🥕', packaged:'📦', beverages:'🧃', other:'🍱' };

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const st = STATUS[food.status] || STATUS.available;
  const isExpiring = new Date(food.expiryDate) - new Date() < 86400000 * 2;

  return (
    <div style={S.card} onClick={() => navigate(`/food/${food._id}`)}>
      {/* Image / placeholder */}
      <div style={S.imgWrap}>
        {food.image
          ? <img src={food.image} alt={food.title} style={S.img} />
          : <div style={S.imgPlaceholder}><span style={{ fontSize:48 }}>{CATICON[food.category]||'🍱'}</span></div>
        }
        <span style={{ ...S.statusBadge, color:st.color, background:st.bg }}>{food.status}</span>
        {isExpiring && food.status==='available' && (
          <span style={S.expiringBadge}>⚡ Expiring soon</span>
        )}
      </div>
      {/* Body */}
      <div style={S.body}>
        <div style={S.catChip}>{CATICON[food.category]||'🍱'} {food.category}</div>
        <h3 style={S.title}>{food.title}</h3>
        <div style={S.metaRow}>
          <span style={S.meta}>📦 {food.quantity}</span>
          <span style={S.metaDot}>•</span>
          <span style={S.meta}>⏰ {new Date(food.expiryDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
        </div>
        <div style={S.locationRow}>
          <span style={S.locationPin}>📍</span>
          <span style={S.locationText}>{food.address}</span>
        </div>
        {food.donor && (
          <div style={S.donorRow}>
            <div style={S.donorAvatar}>{food.donor.name[0]}</div>
            <span style={S.donorName}>{food.donor.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const S = {
  card: {
    background:'#fff', borderRadius:16, overflow:'hidden', cursor:'pointer',
    boxShadow:'0 2px 12px rgba(45,106,79,0.07)', border:'1px solid #f0faf4',
    transition:'transform 0.15s, box-shadow 0.15s', display:'flex', flexDirection:'column',
  },
  imgWrap: { position:'relative', height:160, flexShrink:0 },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  imgPlaceholder: { width:'100%', height:'100%', background:'linear-gradient(135deg,#d8f3dc,#b7e4c7)', display:'flex', alignItems:'center', justifyContent:'center' },
  statusBadge: { position:'absolute', top:10, right:10, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, textTransform:'capitalize' },
  expiringBadge: { position:'absolute', top:10, left:10, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, background:'#fff3e0', color:'#f4a261' },
  body: { padding:'14px 16px', flex:1, display:'flex', flexDirection:'column', gap:6 },
  catChip: { fontSize:11, color:'#52b788', fontWeight:600, textTransform:'capitalize' },
  title: { fontSize:15, fontWeight:700, color:'#1b4332', margin:0, lineHeight:1.3 },
  metaRow: { display:'flex', alignItems:'center', gap:6 },
  meta: { fontSize:12, color:'#888' },
  metaDot: { color:'#ccc', fontSize:10 },
  locationRow: { display:'flex', alignItems:'flex-start', gap:4 },
  locationPin: { fontSize:12, flexShrink:0, marginTop:1 },
  locationText: { fontSize:12, color:'#aaa', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical' },
  donorRow: { display:'flex', alignItems:'center', gap:8, marginTop:4, paddingTop:10, borderTop:'1px solid #f0faf4' },
  donorAvatar: { width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#2d6a4f,#52b788)', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },
  donorName: { fontSize:12, fontWeight:600, color:'#2d6a4f' },
};

export default FoodCard;
