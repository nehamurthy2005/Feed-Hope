import React, { useEffect, useState } from "react";
import {
  adminGetStats,
  adminGetUsers,
  adminDeleteUser,
  adminGetFood,
  adminDeleteFood,
} from "../utils/api";
import { toast } from "react-toastify";

const TABS = ["Overview", "Users", "Listings"];

const AdminDashboard = () => {
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u, f] = await Promise.all([
          adminGetStats(),
          adminGetUsers(),
          adminGetFood(),
        ]);
        setStats(s.data);
        setUsers(u.data);
        setFoods(f.data);
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`))
      return;
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteFood = async (id, title) => {
    if (!window.confirm(`Remove listing "${title}"?`)) return;
    try {
      await adminDeleteFood(id);
      setFoods((prev) => prev.filter((f) => f._id !== id));
      toast.success("Listing removed");
    } catch {
      toast.error("Failed to remove listing");
    }
  };

  if (loading) return <div style={S.loading}>Loading admin dashboard...</div>;

  const statusColor = {
    available: "#2e7d32",
    claimed: "#f57c00",
    completed: "#1565c0",
    expired: "#c62828",
  };
  const roleColor = { donor: "#1565c0", receiver: "#6a1b9a", admin: "#c62828" };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.headerTitle}>Admin Dashboard</h2>
        <p style={S.headerSub}>Platform management &amp; analytics</p>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "Overview" && stats && (
        <div style={S.content}>
          {/* Stat cards */}
          <div style={S.statGrid}>
            {[
              {
                label: "Total Users",
                value: stats.users.total,
                icon: "👥",
                color: "#e3f2fd",
              },
              {
                label: "Donors",
                value: stats.users.donors,
                icon: "🙌",
                color: "#e8f5e9",
              },
              {
                label: "Receivers",
                value: stats.users.receivers,
                icon: "🏠",
                color: "#fce4ec",
              },
              {
                label: "Total Listings",
                value: stats.food.total,
                icon: "📋",
                color: "#fff8e1",
              },
              {
                label: "Available",
                value: stats.food.available,
                icon: "✅",
                color: "#e8f5e9",
              },
              {
                label: "Expired",
                value: stats.food.expired,
                icon: "⏰",
                color: "#fbe9e7",
              },
              {
                label: "Total Donations",
                value: stats.donations.total,
                icon: "🤝",
                color: "#f3e5f5",
              },
              {
                label: "Completed",
                value: stats.donations.completed,
                icon: "🎉",
                color: "#e1f5fe",
              },
            ].map((c) => (
              <div key={c.label} style={{ ...S.statCard, background: c.color }}>
                <div style={S.statIcon}>{c.icon}</div>
                <div style={S.statVal}>{c.value}</div>
                <div style={S.statLabel}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Top donors */}
          <div style={S.tableCard}>
            <h3 style={S.tableTitle}>Top 5 Donors</h3>
            <table style={S.table}>
              <thead>
                <tr style={S.thead}>
                  <th style={S.th}>#</th>
                  <th style={S.th}>Name</th>
                  <th style={S.th}>Email</th>
                  <th style={S.th}>Total Posts</th>
                </tr>
              </thead>
              <tbody>
                {stats.topDonors.map((d, i) => (
                  <tr key={d._id} style={i % 2 === 0 ? S.rowEven : {}}>
                    <td style={S.td}>{i + 1}</td>
                    <td style={S.td}>{d.name}</td>
                    <td style={{ ...S.td, color: "#888" }}>{d.email}</td>
                    <td style={{ ...S.td, fontWeight: 700, color: "#2e7d32" }}>
                      {d.totalPosts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Food by category */}
          <div style={S.tableCard}>
            <h3 style={S.tableTitle}>Food by Category</h3>
            {stats.foodByCategory.map((c) => {
              const total = stats.food.total || 1;
              const pct = Math.round((c.count / total) * 100);
              return (
                <div key={c._id} style={S.catRow}>
                  <span style={S.catName}>{c._id}</span>
                  <div style={S.catBarWrap}>
                    <div style={{ ...S.catBar, width: `${pct}%` }} />
                  </div>
                  <span style={S.catCount}>
                    {c.count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === "Users" && (
        <div style={S.content}>
          <div style={S.tableCard}>
            <h3 style={S.tableTitle}>{users.length} Registered Users</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Name</th>
                    <th style={S.th}>Email</th>
                    <th style={S.th}>Role</th>
                    <th style={S.th}>Phone</th>
                    <th style={S.th}>Joined</th>
                    <th style={S.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={i % 2 === 0 ? S.rowEven : {}}>
                      <td style={S.td}>{u.name}</td>
                      <td style={{ ...S.td, color: "#666" }}>{u.email}</td>
                      <td style={S.td}>
                        <span
                          style={{
                            ...S.badge,
                            background: roleColor[u.role] + "22",
                            color: roleColor[u.role],
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...S.td, color: "#888" }}>
                        {u.phone || "—"}
                      </td>
                      <td style={{ ...S.td, color: "#888" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={S.td}>
                        {u.role !== "admin" && (
                          <button
                            style={S.deleteBtn}
                            onClick={() => handleDeleteUser(u._id, u.name)}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── LISTINGS ── */}
      {tab === "Listings" && (
        <div style={S.content}>
          <div style={S.tableCard}>
            <h3 style={S.tableTitle}>{foods.length} Total Listings</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Title</th>
                    <th style={S.th}>Donor</th>
                    <th style={S.th}>Category</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Expiry</th>
                    <th style={S.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((f, i) => (
                    <tr key={f._id} style={i % 2 === 0 ? S.rowEven : {}}>
                      <td style={{ ...S.td, fontWeight: 500 }}>{f.title}</td>
                      <td style={{ ...S.td, color: "#666" }}>
                        {f.donor?.name || "—"}
                      </td>
                      <td style={{ ...S.td, textTransform: "capitalize" }}>
                        {f.category}
                      </td>
                      <td style={S.td}>
                        <span
                          style={{
                            ...S.badge,
                            background:
                              (statusColor[f.status] || "#888") + "22",
                            color: statusColor[f.status] || "#888",
                          }}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td style={{ ...S.td, color: "#888" }}>
                        {new Date(f.expiryDate).toLocaleDateString()}
                      </td>
                      <td style={S.td}>
                        <button
                          style={S.deleteBtn}
                          onClick={() => handleDeleteFood(f._id, f.title)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const S = {
  page: {
    minHeight: "90vh",
    background: "#f5f7fa",
    fontFamily: "Segoe UI, sans-serif",
  },
  loading: { padding: 80, textAlign: "center", color: "#888" },
  header: { background: "#1b5e20", padding: "32px 36px" },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    margin: "0 0 4px",
    fontWeight: 700,
  },
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 14 },
  tabs: {
    background: "#fff",
    display: "flex",
    gap: 0,
    borderBottom: "2px solid #e8f5e9",
    padding: "0 32px",
  },
  tab: {
    padding: "14px 24px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#666",
    fontWeight: 500,
    borderBottom: "3px solid transparent",
    marginBottom: -2,
  },
  tabActive: { color: "#2e7d32", borderBottom: "3px solid #2e7d32" },
  content: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
    gap: 16,
    marginBottom: 28,
  },
  statCard: { borderRadius: 12, padding: "20px 16px", textAlign: "center" },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statVal: { fontSize: 26, fontWeight: 800, color: "#1b5e20", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "#666" },
  tableCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 24,
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1b5e20",
    margin: "0 0 16px",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  thead: { background: "#f1f8e9" },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    color: "#2e7d32",
    fontWeight: 600,
    fontSize: 13,
  },
  td: { padding: "10px 14px", borderBottom: "1px solid #f1f8e9", fontSize: 14 },
  rowEven: { background: "#fafffe" },
  badge: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  deleteBtn: {
    background: "#fbe9e7",
    color: "#c62828",
    border: "none",
    padding: "5px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  },
  catRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  catName: {
    width: 90,
    fontSize: 13,
    color: "#555",
    textTransform: "capitalize",
  },
  catBarWrap: {
    flex: 1,
    background: "#f1f8e9",
    borderRadius: 4,
    height: 16,
    overflow: "hidden",
  },
  catBar: {
    height: "100%",
    background: "#2e7d32",
    borderRadius: 4,
    transition: "width 0.5s",
  },
  catCount: { fontSize: 12, color: "#888", width: 80, textAlign: "right" },
};

export default AdminDashboard;
