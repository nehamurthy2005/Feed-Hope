import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../utils/api";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    password: "",
    notifyNearby: user?.notifyNearby !== false,
    alertRadius: user?.alertRadius || 10,
  });
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") fd.append(k, v);
      });
      const { data } = await updateProfile(fd);
      login({ ...user, ...data });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const fd = new FormData();
          fd.append("lat", pos.coords.latitude);
          fd.append("lng", pos.coords.longitude);
          const { data } = await updateProfile(fd);
          login({ ...user, ...data });
          toast.success("Location saved for nearby alerts!");
        } catch {
          toast.error("Failed to save location");
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        toast.error("Could not get location");
        setLocLoading(false);
      },
    );
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Avatar */}
        <div style={S.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
        <h2 style={S.title}>{user?.name}</h2>
        <p style={S.meta}>
          ✉️ {user?.email} &nbsp;|&nbsp; 🏷️ {user?.role}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={S.sectionLabel}>Personal Info</div>
          {[
            { name: "name", placeholder: "Full Name", type: "text" },
            { name: "phone", placeholder: "Phone Number", type: "text" },
            { name: "address", placeholder: "Address", type: "text" },
            {
              name: "password",
              placeholder: "New Password (leave blank to keep)",
              type: "password",
            },
          ].map((f) => (
            <input
              key={f.name}
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              style={S.input}
            />
          ))}

          {/* Nearby alerts — only for receivers */}
          {user?.role === "receiver" && (
            <>
              <div style={S.sectionLabel}>Nearby Food Alerts</div>
              <div style={S.toggleRow}>
                <div>
                  <div style={S.toggleLabel}>
                    Email me when food is posted nearby
                  </div>
                  <div style={S.toggleSub}>
                    You'll get an email whenever a donor posts food within your
                    radius
                  </div>
                </div>
                <div
                  style={{
                    ...S.toggle,
                    background: form.notifyNearby ? "#2e7d32" : "#ccc",
                  }}
                  onClick={() =>
                    setForm({ ...form, notifyNearby: !form.notifyNearby })
                  }
                >
                  <div
                    style={{
                      ...S.toggleKnob,
                      transform: form.notifyNearby
                        ? "translateX(22px)"
                        : "translateX(2px)",
                    }}
                  />
                </div>
              </div>

              {form.notifyNearby && (
                <>
                  <div style={S.radiusRow}>
                    <label style={S.radiusLabel}>
                      Alert radius: <strong>{form.alertRadius} km</strong>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={form.alertRadius}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          alertRadius: parseInt(e.target.value),
                        })
                      }
                      style={{ flex: 1, accentColor: "#2e7d32" }}
                    />
                  </div>
                  <button
                    type="button"
                    style={S.locBtn}
                    onClick={captureLocation}
                    disabled={locLoading}
                  >
                    {locLoading
                      ? "Getting location..."
                      : "📍 Update My Location"}
                  </button>
                  <p style={S.locNote}>
                    Your location is used only to find nearby food — it is never
                    shown publicly.
                  </p>
                </>
              )}
            </>
          )}

          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

const S = {
  page: { minHeight: "90vh", background: "#f1f8e9", padding: "40px 20px" },
  card: {
    background: "#fff",
    maxWidth: 500,
    margin: "0 auto",
    padding: "36px 32px",
    borderRadius: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#2e7d32",
    color: "#fff",
    fontSize: 32,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  title: { textAlign: "center", color: "#2e7d32", margin: "0 0 4px" },
  meta: { textAlign: "center", color: "#888", fontSize: 13, marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2e7d32",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 10,
    marginTop: 8,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    marginBottom: 12,
    border: "1.5px solid #c8e6c9",
    borderRadius: 8,
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
  },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9fbe7",
    padding: "14px 16px",
    borderRadius: 10,
    marginBottom: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1b5e20",
    marginBottom: 3,
  },
  toggleSub: { fontSize: 12, color: "#888" },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s",
    flexShrink: 0,
  },
  toggleKnob: {
    position: "absolute",
    top: 3,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.2s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  },
  radiusRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  radiusLabel: {
    fontSize: 13,
    color: "#555",
    whiteSpace: "nowrap",
    minWidth: 130,
  },
  locBtn: {
    width: "100%",
    padding: "10px",
    background: "#e8f5e9",
    color: "#2e7d32",
    border: "1.5px solid #a5d6a7",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 6,
  },
  locNote: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 12,
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 10,
  },
};

export default Profile;
