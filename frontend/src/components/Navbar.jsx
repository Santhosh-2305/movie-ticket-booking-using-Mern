import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brand}>🎬 CineBook</Link>

      {/* Desktop links */}
      <div style={s.links}>
        <Link to="/" style={s.link}>Movies</Link>
        <Link to="/bookings" style={s.link}>My Bookings</Link>
        {user ? (
          <div style={s.userArea}>
            <span style={s.userName}>👤 {user.name}</span>
            <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
          </div>
        ) : (
          <div style={s.authLinks}>
            <Link to="/login" style={s.link}>Login</Link>
            <Link to="/register" style={s.registerBtn}>Register</Link>
            <Link to="/admin" style={s.adminLink} title="Admin">🔐</Link>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={s.mobileMenu}>
          <Link to="/" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link to="/bookings" style={s.mobileLink} onClick={() => setMenuOpen(false)}>My Bookings</Link>
          {user ? (
            <>
              <span style={{ ...s.mobileLink, color: "#aaa" }}>👤 {user.name}</span>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={s.mobileLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const s = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#0d0d1a",
    borderBottom: "2px solid #e94560",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#e94560",
    letterSpacing: "-0.5px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  link: {
    color: "#ccc",
    fontWeight: "500",
    fontSize: "0.95rem",
    transition: "color 0.2s",
  },
  userArea: { display: "flex", alignItems: "center", gap: "0.8rem" },
  userName: { color: "#e94560", fontWeight: "600", fontSize: "0.9rem" },
  logoutBtn: {
    padding: "0.4rem 1rem",
    background: "transparent",
    border: "1px solid #e94560",
    color: "#e94560",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  authLinks: { display: "flex", alignItems: "center", gap: "1rem" },
  registerBtn: {
    padding: "0.4rem 1.1rem",
    background: "#e94560",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    color: "#f0f0f0",
    fontSize: "1.4rem",
  },
  mobileMenu: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    padding: "0.5rem 0",
    borderTop: "1px solid #222",
  },
  mobileLink: {
    color: "#ccc",
    fontWeight: "500",
    fontSize: "1rem",
    padding: "0.3rem 0",
  },
  adminLink: {
    fontSize: "1rem",
    opacity: 0.4,
    transition: "opacity 0.2s",
  },
  mobileLogout: {
    background: "none",
    border: "1px solid #e94560",
    color: "#e94560",
    borderRadius: "6px",
    padding: "0.4rem 1rem",
    fontWeight: "600",
    width: "fit-content",
  },
};
