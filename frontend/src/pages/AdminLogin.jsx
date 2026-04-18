import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";

const API = import.meta.env.VITE_API_URL || "/api";

export default function AdminLogin() {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, form);
      adminLogin({ name: res.data.name, token: res.data.token });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Orbs */}
      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.card}>
        {/* Badge */}
        <div style={s.badge}>🔐 ADMIN PORTAL</div>

        <div style={s.logo}>🎬</div>
        <h1 style={s.title}>CineBook Admin</h1>
        <p style={s.sub}>Sign in with your administrator credentials</p>

        {error && (
          <div style={s.errorBox}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          {/* Email */}
          <div style={s.field}>
            <label style={s.label}>Admin Email</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>✉️</span>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@cinebook.com"
                required
                style={s.input}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>🔒</span>
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{ ...s.input, paddingRight: "2.8rem" }}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={s.eyeBtn}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={s.btn}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={s.spinner} /> Authenticating...
              </span>
            ) : "Access Dashboard →"}
          </button>
        </form>

        <p style={s.back}>
          <a href="/" style={s.backLink}>← Back to CineBook</a>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #050510 0%, #0f0520 50%, #050510 100%)",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "fixed", top: "5%", left: "10%",
    width: 400, height: 400,
    background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
    borderRadius: "50%", pointerEvents: "none", filter: "blur(60px)",
  },
  orb2: {
    position: "fixed", bottom: "10%", right: "5%",
    width: 350, height: 350,
    background: "radial-gradient(circle, rgba(233,69,96,0.12) 0%, transparent 70%)",
    borderRadius: "50%", pointerEvents: "none", filter: "blur(60px)",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: 420,
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    animation: "slideUp 0.4s ease-out",
  },
  badge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "2px",
    padding: "0.3rem 1rem",
    borderRadius: 20,
    marginBottom: "1.2rem",
  },
  logo: { fontSize: "2.8rem", marginBottom: "0.4rem" },
  title: { fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: "0.3rem" },
  sub: { color: "#666", fontSize: "0.85rem", marginBottom: "1.8rem" },
  errorBox: {
    background: "rgba(233,69,96,0.12)",
    border: "1px solid rgba(233,69,96,0.4)",
    color: "#ff8099",
    borderRadius: 10,
    padding: "0.7rem 1rem",
    fontSize: "0.88rem",
    marginBottom: "1rem",
    textAlign: "left",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.8rem", color: "#aaa", fontWeight: 600 },
  inputWrap: { position: "relative" },
  icon: {
    position: "absolute", left: 12, top: "50%",
    transform: "translateY(-50%)", fontSize: "0.9rem", pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f0f0f0",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  eyeBtn: {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", fontSize: "1rem",
  },
  btn: {
    padding: "0.85rem",
    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: "0.95rem",
    fontWeight: 700,
    marginTop: "0.5rem",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
    transition: "opacity 0.2s",
  },
  spinner: {
    width: 16, height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  back: { marginTop: "1.5rem" },
  backLink: { color: "#555", fontSize: "0.85rem", textDecoration: "none" },
};
