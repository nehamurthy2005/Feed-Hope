import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById, claimFood, updateDonationStatus, getMyDonations } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import QRPickupModal from '../components/QRPickupModal';
import { toast } from 'react-toastify';

const STATUS_STYLE = {
  available: { color: '#2d6a4f', bg: '#e8f5e9' },
  claimed:   { color: '#f4a261', bg: '#fff3e0' },
  completed: { color: '#1565c0', bg: '#e3f2fd' },
  expired:   { color: '#c62828', bg: '#fbe9e7' },
};

const CAT_ICON = { cooked: '🍲', raw: '🥕', packaged: '📦', beverages: '🧃', other: '🍱' };

const FoodDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [food, setFood]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [claiming, setClaiming]   = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showQR, setShowQR]       = useState(false);
  const [donationId, setDonationId] = useState(null);

  useEffect(() => {
    getFoodById(id)
      .then(({ data }) => setFood(data))
      .catch(() => toast.error('Food listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !food) return;
    const isDonor = food.donor?._id === user._id || food.donor === user._id;
    if (isDonor && food.status === 'claimed') {
      getMyDonations('donor')
        .then(({ data }) => {
          const match = data.find(d => d.food?._id === id || d.food === id);
          if (match) setDonationId(match._id);
        })
        .catch(() => {});
    }
  }, [user, food, id]);

  const handleClaim = async () => {
    if (!user) { navigate('/login'); return; }
    setClaiming(true);
    try {
      await claimFood(id);
      toast.success('Food claimed! Head to the pickup location 🎉');
      setFood(prev => ({ ...prev, status: 'claimed', claimedBy: user._id }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not claim food');
    } finally { setClaiming(false); }
  };

  const handleMarkComplete = async () => {
    if (!donationId) return;
    setCompleting(true);
    try {
      await updateDonationStatus(donationId, 'completed');
      toast.success('Donation marked as completed! Thank you 🙏');
      setFood(prev => ({ ...prev, status: 'completed' }));
    } catch (err) {
      toast.error('Could not update status');
    } finally { setCompleting(false); }
  };

  const openDirections = () => {
    if (!food?.location?.lat) { toast.error('No location set for this listing'); return; }
    const { lat, lng } = food.location;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lat},${lng}&travelmode=driving`,
            '_blank'
          );
        },
        () => {
          window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
        }
      );
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    }
  };

  if (loading) return <div style={S.center}>Loading...</div>;
  if (!food)   return <div style={S.center}>Listing not found.</div>;

  const donorId    = food.donor?._id || food.donor;
  const isDonor    = user?._id === donorId;
  const isReceiver = user?.role === 'receiver' && !isDonor;
  const isClaimed  = food.status === 'claimed';
  const isAvail    = food.status === 'available';

  const receiverClaimedThis = isReceiver && food.claimedBy &&
    (food.claimedBy === user?._id || food.claimedBy?._id === user?._id);

  const st = STATUS_STYLE[food.status] || STATUS_STYLE.available;

  return (
    <div style={S.page}>
      {/* Breadcrumb */}
      <div style={S.breadcrumb}>
        <span style={S.breadLink} onClick={() => navigate('/food')}>Browse Food</span>
        <span style={S.breadSep}>›</span>
        <span style={S.breadCurrent}>{food.title || 'roti curry'}</span>
      </div>

      <div style={S.layout}>
        {/* ── Left Content Column ── */}
        <div style={S.left}>
          {/* Main Hero Image Frame */}
          <div style={S.imgWrap}>
            {food.image
              ? <img src={food.image} alt={food.title} style={S.img} />
              : <div style={S.imgPlaceholder}><span style={{ fontSize: 72 }}>{CAT_ICON[food.category] || '🍱'}</span></div>
            }
            <span style={{ ...S.statusBadge, color: st.color, background: st.bg }}>● {food.status}</span>
          </div>

          {/* New Sub-bar Data Grid Strip */}
          <div style={S.subBarGrid}>
            <div style={S.subBarItem}>
              <span style={{ fontSize: 18 }}>{CAT_ICON[food.category] || '📦'}</span>
              <div>
                <div style={S.subLabel}>Category</div>
                <div style={S.subVal}>{food.category || 'Packaged'}</div>
              </div>
            </div>
            <div style={S.subBarItem}>
              <div style={S.avatarMini}>{food.donor?.name?.[0]?.toUpperCase() || 'E'}</div>
              <div>
                <div style={S.subLabel}>Posted by</div>
                <div style={S.subVal}>{food.donor?.name || 'Emilia'} <span style={S.subTime}>• 2 days ago</span></div>
              </div>
            </div>
            <div style={S.subBarItem}>
              <div>
                <div style={S.subLabel}>Food ID</div>
                <div style={S.subVal}>#{food.foodId || 'FD12345'}</div>
              </div>
            </div>
          </div>

          {/* About section containing description and detailed 2x2 specification matrix */}
          <div style={S.card}>
            <h3 style={S.cardHeading}>About this food</h3>
            <p style={S.desc}>{food.description || 'Delicious homemade roti curry packed with love. Freshly prepared and safely packed. Available for anyone in need.'}</p>

            <div style={S.metaGrid}>
              {[
                { icon: '📦', label: 'Quantity', value: `${food.quantity || '30 servings'}` },
                { icon: '📅', label: 'Expiry Date', value: food.expiryDate ? new Date(food.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '20 May 2026' },
                { icon: '📍', label: 'Address', value: food.address || 'New jersey' },
                { icon: '🍃', label: 'Food Type', value: food.foodType || 'Vegetarian' },
              ].map((m, idx) => (
                <div key={idx} style={S.metaChipCard}>
                  <span style={S.metaIcon}>{m.icon}</span>
                  <div>
                    <div style={S.metaLabel}>{m.label}</div>
                    <div style={S.metaVal}>{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Sidebar Column ── */}
        <div style={S.right}>
          
          {/* ACTIONS CARD */}
          <div style={S.card}>
            <p style={S.sectionLabel}>Actions</p>
            {isAvail && isReceiver && (
              <button style={S.btnPrimary} onClick={handleClaim} disabled={claiming}>
                {claiming ? 'Claiming...' : '🧡 Claim This Food'}
              </button>
            )}
            {isClaimed && !receiverClaimedThis && (
              <div style={{ ...S.infoBox, color: st.color, background: st.bg }}>
                This food has already been claimed.
              </div>
            )}
            {receiverClaimedThis && (
              <>
                <div style={S.claimedBox}>✅ You claimed this! Head to the pickup location.</div>
                <button style={S.btnQR} onClick={() => setShowQR(true)}>📷 Show QR Code to Donor</button>
                <p style={S.hint}>At pickup, show this QR to the donor so they can confirm the handoff.</p>
              </>
            )}
            <button style={S.btnWhatsapp} onClick={() => {
              const text = `🍱 *${food.title}* is available for free!\n📦 ${food.quantity}\n📍 ${food.address}\n\nClaim it: ${window.location.href}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}>
              <span style={{ marginRight: 6 }}>📲</span> Share on WhatsApp
            </button>
          </div>

          {/* DONOR INFORMATION CARD */}
          {isReceiver && (
            <div style={S.card}>
              <p style={S.sectionLabel}>Donor Information</p>
              <div style={S.donorProfileRow}>
                <div style={S.avatarMain}>{food.donor?.name?.[0]?.toUpperCase() || 'E'}</div>
                <div>
                  <div style={S.donorName}>{food.donor?.name || 'Emilia'}</div>
                  <span style={S.verifiedBadge}>✓ Verified Donor</span>
                </div>
              </div>
              <div style={S.contactDetailsList}>
                <div style={S.contactItem}>📞 {food.donor?.phone || '+1 (555) 123-4567'}</div>
                <div style={S.contactItem}>✉️ {food.donor?.email || 'emilia@example.com'}</div>
              </div>
            </div>
          )}

          {/* PICKUP LOCATION MAP CARD */}
          {food.location?.lat && (
            <div style={S.card}>
              <div style={S.mapHeader}>
                <p style={S.sectionLabel}>{isDonor ? 'Your Pickup Location' : 'Pickup Location'}</p>
                {isReceiver && <button style={S.dirBtn} onClick={openDirections}>Directions ↗</button>}
              </div>
              <MapView foods={[food]} />
              <div style={S.mapFooterAddress}>
                <div style={S.footerAddrTitle}>{food.address || 'New jersey'}</div>
                <div style={S.coordRow}>
                  <span style={S.coord}>{food.location.lat.toFixed(4)}° N, {food.location.lng.toFixed(4)}° W</span>
                  <button style={S.copyBtn} onClick={() => {
                    navigator.clipboard.writeText(`${food.location.lat},${food.location.lng}`);
                    toast.success('Coordinates copied!');
                  }}>📋</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showQR && <QRPickupModal food={food} user={user} onClose={() => setShowQR(false)} />}
    </div>
  );
};

const S = {
  page: { fontFamily: "'DM Sans', sans-serif", padding: '24px', background: '#fafdfb', minHeight: '100vh' },
  center: { padding: 80, textAlign: 'center', color: '#95b8a8' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 },
  breadLink: { fontSize: 13, color: '#52b788', cursor: 'pointer', fontWeight: 600 },
  breadSep: { color: '#ccc', fontSize: 13 },
  breadCurrent: { fontSize: 13, color: '#666' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' },
  left:  { display: 'flex', flexDirection: 'column', gap: 20 },
  right: { display: 'flex', flexDirection: 'column', gap: 20 },
  imgWrap: { position: 'relative', borderRadius: 16, overflow: 'hidden', height: 360, width: '100%', background: '#f5faf7' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { width: '100%', height: '100%', background: 'linear-gradient(135deg,#d8f3dc,#b7e4c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statusBadge: { position: 'absolute', top: 16, right: 16, fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 },
  
  // Sub Info Bar Style Layout Strip
  subBarGrid: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, background: '#fff', borderRadius: 16, padding: '16px 24px', border: '0.5px solid #e8f5e9', boxShadow: '0 1px 8px rgba(45,106,79,0.04)' },
  subBarItem: { display: 'flex', alignItems: 'center', gap: 12 },
  subLabel: { fontSize: 11, color: '#95b8a8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' },
  subVal: { fontSize: 14, color: '#1b4332', fontWeight: 700, marginTop: 1 },
  subTime: { fontSize: 12, color: '#aaa', fontWeight: 400 },
  avatarMini: { width: 32, height: 32, borderRadius: '50%', background: '#2d6a4f', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },

  // Primary Containers
  card: { background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 1px 8px rgba(45,106,79,0.05)', border: '0.5px solid #e8f5e9' },
  cardHeading: { fontSize: 16, fontWeight: 800, color: '#1b4332', margin: '0 0 12px' },
  desc: { fontSize: 14, color: '#555', lineHeight: 1.6, margin: '0 0 20px' },
  
  // Realized 2x2 Clean Grid Matrix Fixes
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  metaChipCard: { background: '#fafdff', border: '1px solid #f0f7f4', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 },
  metaIcon: { fontSize: 20 },
  metaLabel: { fontSize: 11, color: '#95b8a8', fontWeight: 600, textTransform: 'uppercase' },
  metaVal: { fontSize: 14, color: '#1b4332', fontWeight: 700, marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#95b8a8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 14px' },

  // Buttons Configuration Styles
  btnPrimary: { width: '100%', padding: '14px', background: '#1e4636', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 12 },
  btnQR: { width: '100%', padding: '12px', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 },
  btnWhatsapp: { width: '100%', padding: '12px', background: '#f5faf7', color: '#2d6a4f', border: '1px solid #e1efe6', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  infoBox: { padding: '12px 16px', borderRadius: 12, fontWeight: 600, textAlign: 'center', marginBottom: 12, fontSize: 13 },
  claimedBox: { padding: '12px 16px', borderRadius: 12, background: '#e8f5e9', color: '#2d6a4f', fontWeight: 600, fontSize: 13, marginBottom: 12 },
  hint: { fontSize: 12, color: '#95b8a8', textAlign: 'center', lineHeight: 1.4, margin: '4px 0 12px' },

  // Donor Sidebar Contexts Styles
  donorProfileRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarMain: { width: 44, height: 44, borderRadius: '50%', background: '#1a3a2b', color: '#fff', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  donorName: { fontSize: 15, fontWeight: 700, color: '#1b4332' },
  verifiedBadge: { display: 'inline-block', fontSize: 11, background: '#e8f5e9', color: '#2d6a4f', padding: '3px 8px', borderRadius: 12, fontWeight: 600, marginTop: 4 },
  contactDetailsList: { display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #f0f7f4', paddingTop: 14 },
  contactItem: { fontSize: 13, color: '#444', display: 'flex', alignItems: 'center' },

  // Map Integration Frame Styles
  mapHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dirBtn: { fontSize: 13, color: '#52b788', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' },
  mapFooterAddress: { marginTop: 12 },
  footerAddrTitle: { fontSize: 14, fontWeight: 700, color: '#1b4332', marginBottom: 4 },
  coordRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  coord: { fontSize: 12, color: '#777' },
  copyBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }
};

export default FoodDetail;