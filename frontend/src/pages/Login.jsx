import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";

// SVG icons (inline, no extra deps)
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const users = JSON.parse(localStorage.getItem("cinebook_users") || "[]");
      const found = users.find((u) => u.email === form.email && u.password === form.password);
      if (!found) { setError("Invalid email or password. Please try again."); return; }
      login({ name: found.name, email: found.email });
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎬</div>
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-sm" style={{ color: "#888" }}>Sign in to your CineBook account</p>
      </div>

      {/* Error */}
      {error && (
        <div className="animate-fade-in flex items-start gap-2 rounded-xl px-4 py-3 mb-5 text-sm"
          style={{ background: "rgba(233,69,96,0.12)", border: "1px solid rgba(233,69,96,0.4)", color: "#ff8099" }}>
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#aaa" }}>Email address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#666" }}>
              <EmailIcon />
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="auth-input w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#aaa" }}>Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#666" }}>
              <LockIcon />
            </span>
            <input
              name="password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="auth-input w-full rounded-xl pl-10 pr-11 py-3 text-sm text-white transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: showPw ? "#7c3aed" : "#555", background: "none", border: "none" }}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              <EyeIcon off={showPw} />
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded"
            style={{ accentColor: "#7c3aed", width: 15, height: 15 }}
          />
          <label htmlFor="remember" className="text-xs" style={{ color: "#888" }}>Remember me</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white text-sm mt-1 transition-all duration-200"
          style={{
            background: loading
              ? "rgba(124,58,237,0.5)"
              : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            transform: loading ? "none" : undefined,
            boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
            border: "none",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              Signing in...
            </span>
          ) : "Sign In →"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        <span className="text-xs" style={{ color: "#555" }}>OR</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>

      <p className="text-center text-sm" style={{ color: "#666" }}>
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold transition-colors" style={{ color: "#a78bfa" }}
          onMouseEnter={(e) => (e.target.style.color = "#7c3aed")}
          onMouseLeave={(e) => (e.target.style.color = "#a78bfa")}>
          Create one free
        </Link>
      </p>
    </AuthCard>
  );
}
