import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.brand}>
        🍱 WasteFood Manager
      </Link>

      {/* Desktop links */}
      <div style={S.links}>
        <Link to="/food" style={S.link}>
          Browse Food
        </Link>
        <Link to="/impact" style={S.link}>
          Our Impact
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" style={S.link}>
              Dashboard
            </Link>
            {user.role === "donor" && (
              <Link to="/post-food" style={S.link}>
                Post Food
              </Link>
            )}
            {user.role === "admin" && (
              <Link to="/admin" style={{ ...S.link, color: "#ffcc80" }}>
                Admin
              </Link>
            )}
            <div style={S.menuWrap}>
              <button style={S.avatarBtn} onClick={() => setOpen(!open)}>
                {user.name[0].toUpperCase()}
              </button>
              {open && (
                <div style={S.dropdown}>
                  <Link
                    to="/profile"
                    style={S.dropItem}
                    onClick={() => setOpen(false)}
                  >
                    My Profile
                  </Link>
                  <div style={S.dropDivider} />
                  <button style={S.dropItemBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={S.link}>
              Login
            </Link>
            <Link to="/register" style={S.registerBtn}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const S = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    background: "#2e7d32",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    textDecoration: "none",
  },
  links: { display: "flex", alignItems: "center", gap: 20 },
  link: {
    color: "rgba(255,255,255,0.9)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  },
  registerBtn: {
    background: "#fff",
    color: "#2e7d32",
    padding: "6px 16px",
    borderRadius: 6,
    fontWeight: 700,
    textDecoration: "none",
    fontSize: 14,
  },
  menuWrap: { position: "relative" },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#fff",
    color: "#2e7d32",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 14,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 42,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    minWidth: 160,
    overflow: "hidden",
    zIndex: 200,
  },
  dropItem: {
    display: "block",
    padding: "11px 18px",
    color: "#333",
    textDecoration: "none",
    fontSize: 14,
  },
  dropItemBtn: {
    display: "block",
    width: "100%",
    padding: "11px 18px",
    color: "#c62828",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
  },
  dropDivider: { height: 1, background: "#f1f1f1" },
};

export default Navbar;
