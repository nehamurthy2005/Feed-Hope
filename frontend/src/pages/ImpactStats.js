import React, { useEffect, useState } from "react";
import { getImpactStats } from "../utils/api";

const ImpactStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImpactStats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={S.loading}>Loading impact data...</div>;
  if (!stats) return <div style={S.loading}>Could not load stats.</div>;

  const { totals, donationsByMonth, byCategory, recentActivity } = stats;

  // Fill missing months with 0
  const last6 = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const found = donationsByMonth.find((m) => m._id === key);
    last6.push({
      label: d.toLocaleString("default", { month: "short" }),
      count: found ? found.count : 0,
    });
  }
  const maxCount = Math.max(...last6.map((m) => m.count), 1);

  const catColors = {
    cooked: "#2e7d32",
    raw: "#388e3c",
    packaged: "#43a047",
    beverages: "#66bb6a",
    other: "#a5d6a7",
  };

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Our Collective Impact</h1>
        <p style={S.heroSub}>
          Every donation makes a difference. Here's the proof.
        </p>
      </div>

      {/* Big metric cards */}
      <div style={S.section}>
        <div style={S.metricsGrid}>
          {[
            {
              icon: "🍽️",
              value: totals.mealsSaved.toLocaleString(),
              label: "Estimated Meals Saved",
              color: "#e8f5e9",
              border: "#2e7d32",
            },
            {
              icon: "🌍",
              value: `${totals.co2SavedKg.toLocaleString()} kg`,
              label: "CO₂ Emissions Saved",
              color: "#e3f2fd",
              border: "#1565c0",
            },
            {
              icon: "🤝",
              value: totals.completedDonations.toLocaleString(),
              label: "Completed Donations",
              color: "#fff8e1",
              border: "#f57f17",
            },
            {
              icon: "📦",
              value: totals.availableNow.toLocaleString(),
              label: "Available Right Now",
              color: "#fce4ec",
              border: "#c62828",
            },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                ...S.metricCard,
                background: m.color,
                borderTop: `4px solid ${m.border}`,
              }}
            >
              <div style={S.metricIcon}>{m.icon}</div>
              <div style={S.metricValue}>{m.value}</div>
              <div style={S.metricLabel}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary stats */}
      <div style={S.section}>
        <div style={S.secGrid}>
          {[
            { label: "Total Donors", value: totals.donors, icon: "👤" },
            { label: "Total Receivers", value: totals.receivers, icon: "🏠" },
            { label: "Total Listings", value: totals.listings, icon: "📋" },
            {
              label: "Expired (unclaimed)",
              value: totals.expiredListings,
              icon: "⏰",
            },
          ].map((s) => (
            <div key={s.label} style={S.secCard}>
              <span style={S.secIcon}>{s.icon}</span>
              <span style={S.secValue}>{s.value}</span>
              <span style={S.secLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.twoCol}>
        {/* Bar chart - donations per month */}
        <div style={S.chartCard}>
          <h3 style={S.cardTitle}>Donations per Month (last 6 months)</h3>
          <div style={S.barChart}>
            {last6.map((m) => (
              <div key={m.label} style={S.barGroup}>
                <div style={S.barCount}>{m.count}</div>
                <div
                  style={{
                    ...S.bar,
                    height: `${Math.max((m.count / maxCount) * 140, 4)}px`,
                  }}
                />
                <div style={S.barLabel}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div style={S.chartCard}>
          <h3 style={S.cardTitle}>Food Saved by Category</h3>
          {byCategory.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: 24 }}>
              No data yet
            </p>
          ) : (
            <div style={{ marginTop: 16 }}>
              {byCategory.map((c) => {
                const pct = Math.round(
                  (c.count / byCategory.reduce((a, b) => a + b.count, 0)) * 100,
                );
                return (
                  <div key={c._id} style={S.catRow}>
                    <div style={S.catName}>{c._id}</div>
                    <div style={S.catBarWrap}>
                      <div
                        style={{
                          ...S.catBar,
                          width: `${pct}%`,
                          background: catColors[c._id] || "#2e7d32",
                        }}
                      />
                    </div>
                    <div style={S.catPct}>
                      {c.count} ({pct}%)
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ ...S.section, maxWidth: 760, margin: "0 auto 60px" }}>
        <div style={S.chartCard}>
          <h3 style={S.cardTitle}>Recent Completions</h3>
          {recentActivity.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: 24 }}>
              No completed donations yet
            </p>
          ) : (
            <div>
              {recentActivity.map((a) => (
                <div key={a._id} style={S.actRow}>
                  <div style={S.actIcon}>✅</div>
                  <div style={{ flex: 1 }}>
                    <strong>{a.donor?.name || "Donor"}</strong> donated{" "}
                    <strong>{a.food?.title || "food"}</strong> to{" "}
                    <strong>{a.receiver?.name || "Receiver"}</strong>
                    <div style={S.actMeta}>
                      {a.food?.category} •{" "}
                      {new Date(
                        a.completedAt || a.createdAt,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const S = {
  page: {
    minHeight: "90vh",
    background: "#fafafa",
    fontFamily: "Segoe UI, sans-serif",
  },
  loading: { padding: 80, textAlign: "center", color: "#888" },
  hero: {
    background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
    padding: "60px 32px",
    textAlign: "center",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 36,
    margin: "0 0 10px",
    fontWeight: 800,
  },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 17 },
  section: { padding: "36px 32px 0" },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 20,
    maxWidth: 960,
    margin: "0 auto",
  },
  metricCard: {
    borderRadius: 14,
    padding: "28px 20px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  metricIcon: { fontSize: 32, marginBottom: 10 },
  metricValue: {
    fontSize: 30,
    fontWeight: 800,
    color: "#1b5e20",
    marginBottom: 6,
  },
  metricLabel: { fontSize: 13, color: "#555" },
  secGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: 14,
    maxWidth: 760,
    margin: "0 auto",
  },
  secCard: {
    background: "#fff",
    border: "1px solid #e8f5e9",
    borderRadius: 10,
    padding: "16px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  secIcon: { fontSize: 22 },
  secValue: { fontSize: 22, fontWeight: 700, color: "#2e7d32" },
  secLabel: { fontSize: 12, color: "#888" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
    gap: 24,
    padding: "32px 32px 0",
    maxWidth: 960,
    margin: "0 auto",
  },
  chartCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "24px 28px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1b5e20",
    margin: "0 0 16px",
  },
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    height: 170,
    paddingTop: 20,
  },
  barGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  barCount: { fontSize: 12, color: "#888", fontWeight: 500 },
  bar: {
    width: "100%",
    background: "linear-gradient(to top,#2e7d32,#66bb6a)",
    borderRadius: "4px 4px 0 0",
    minHeight: 4,
    transition: "height 0.4s",
  },
  barLabel: { fontSize: 11, color: "#888" },
  catRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  catName: {
    width: 80,
    fontSize: 13,
    color: "#555",
    textTransform: "capitalize",
  },
  catBarWrap: {
    flex: 1,
    background: "#f1f8e9",
    borderRadius: 4,
    height: 18,
    overflow: "hidden",
  },
  catBar: { height: "100%", borderRadius: 4, transition: "width 0.5s" },
  catPct: { fontSize: 12, color: "#888", width: 70, textAlign: "right" },
  actRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 0",
    borderBottom: "1px solid #f1f8e9",
  },
  actIcon: { fontSize: 18, marginTop: 2 },
  actMeta: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
    textTransform: "capitalize",
  },
};

export default ImpactStats;
