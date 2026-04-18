import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "/api";

export default function MyBookings() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  // Edit modal state
  const [editBooking, setEditBooking] = useState(null);
  const [newSeats, setNewSeats] = useState(1);
  const [editLoading, setEditLoading] = useState(false);

  // Cancel confirm state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  useEffect(() => {
    if (user?.email) fetchBookings(user.email);
  }, [user]);

  const fetchBookings = async (emailToSearch) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings?email=${emailToSearch}`);
      setBookings(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchBookings(email); };

  // Cancel booking
  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      const res = await axios.patch(`${API}/bookings/${cancelTarget._id}/cancel`);
      showToast(`✅ Cancelled! Refund: $${res.data.refundAmount}`);
      setCancelTarget(null);
      fetchBookings(email);
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Cancel failed."));
    } finally {
      setCancelLoading(false);
    }
  };

  // Edit booking (update seats)
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editBooking) return;
    setEditLoading(true);
    try {
      await axios.patch(`${API}/bookings/${editBooking._id}/edit`, { seats: newSeats });
      showToast("✅ Booking updated!");
      setEditBooking(null);
      fetchBookings(email);
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Update failed."));
    } finally {
      setEditLoading(false);
    }
  };

  const openEdit = (b) => { setEditBooking(b); setNewSeats(b.seats); };

  return (
    <div>
      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}

      <h2 style={s.heading}>My Bookings</h2>

      <form onSubmit={handleSearch} style={s.form}>
        <input type="email" placeholder="Enter your email to find bookings"
          value={email} onChange={(e) => setEmail(e.target.value)}
          required style={s.input} />
        <button type="submit" style={s.btn} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading && <div style={s.center}><div style={s.spinner} /></div>}

      {!loading && searched && bookings.length === 0 && (
        <div style={s.empty}><p style={{ fontSize: "3rem" }}>🎭</p>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>No bookings found.</p></div>
      )}

      {!loading && bookings.length > 0 && (
        <div style={s.list}>
          <p style={s.count}>{bookings.length} booking{bookings.length > 1 ? "s" : ""} found</p>
          {bookings.map((b) => {
            const cancelled = b.status === "cancelled";
            return (
              <div key={b._id} style={{ ...s.card, opacity: cancelled ? 0.7 : 1 }}>
                <img src={b.movie?.poster || "https://via.placeholder.com/70x100?text=N/A"}
                  alt={b.movie?.title} style={s.poster} />

                <div style={s.cardInfo}>
                  <h3 style={s.movieTitle}>{b.movie?.title || "Unknown Movie"}</h3>
                  <div style={s.tags}>
                    <span style={s.tag}>🎟 {b.seats} seat{b.seats > 1 ? "s" : ""}</span>
                    <span style={{ ...s.tag, color: "#e94560", borderColor: "#e94560" }}>${b.totalPrice}</span>
                    {b.showTime && <span style={{ ...s.tag, color: "#a78bfa", borderColor: "#7c3aed" }}>🕐 {b.showTime}</span>}
                  </div>
                  {/* Seat numbers */}
                  {b.seatNumbers?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem", alignItems: "center" }}>
                      <span style={{ color: "#555", fontSize: "0.78rem", marginRight: "0.2rem" }}>Seats:</span>
                      {b.seatNumbers.map((seat) => (
                        <span key={seat} style={s.seatTag}>{seat}</span>
                      ))}
                    </div>
                  )}
                  <p style={s.meta}>📅 Show: {b.showDate}</p>
                  <p style={s.meta}>🕐 Booked: {new Date(b.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
                  {cancelled && b.refundAmount > 0 && (
                    <p style={{ ...s.meta, color: "#4caf50" }}>💰 Refund: ${b.refundAmount}</p>
                  )}

                  {/* Action buttons */}
                  {!cancelled && (
                    <div style={s.actions}>
                      <button onClick={() => openEdit(b)} style={s.editBtn}>✏️ Edit Seats</button>
                      <button onClick={() => setCancelTarget(b)} style={s.cancelBtn}>❌ Cancel Ticket</button>
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <div style={{
                  ...s.statusBadge,
                  background: cancelled ? "rgba(233,69,96,0.12)" : "rgba(76,175,80,0.12)",
                  color: cancelled ? "#e94560" : "#4caf50",
                  border: `1px solid ${cancelled ? "#e94560" : "#4caf50"}`,
                }}>
                  {cancelled ? "Cancelled" : "Confirmed ✓"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editBooking && (
        <div style={s.overlay} onClick={() => setEditBooking(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>✏️ Edit Booking</h3>
            <p style={{ color: "#888", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
              <strong style={{ color: "#ccc" }}>{editBooking.movie?.title}</strong> — {editBooking.showDate} {editBooking.showTime}
            </p>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={s.label}>Number of Seats (1–10)</label>
                <input type="number" value={newSeats} onChange={e => setNewSeats(Number(e.target.value))}
                  min="1" max="10" required style={s.input} />
                <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                  New total: <strong style={{ color: "#e94560" }}>${(newSeats * (editBooking.movie?.price || 0)).toFixed(2)}</strong>
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setEditBooking(null)} style={s.secBtn}>Cancel</button>
                <button type="submit" disabled={editLoading} style={s.primBtn}>
                  {editLoading ? "Updating..." : "Update Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CANCEL CONFIRM MODAL ── */}
      {cancelTarget && (
        <div style={s.overlay} onClick={() => setCancelTarget(null)}>
          <div style={{ ...s.modal, textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎫</div>
            <h3 style={s.modalTitle}>Cancel Ticket?</h3>
            <p style={{ color: "#888", fontSize: "0.88rem", margin: "0.5rem 0 0.3rem" }}>
              <strong style={{ color: "#ccc" }}>{cancelTarget.movie?.title}</strong>
            </p>
            <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
              {cancelTarget.seats} seat{cancelTarget.seats > 1 ? "s" : ""} · ${cancelTarget.totalPrice}
            </p>
            <div style={{ background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)",
              borderRadius: 10, padding: "0.8rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#4caf50", fontWeight: 700, fontSize: "1rem" }}>
                💰 Refund: ${(cancelTarget.totalPrice * 0.5).toFixed(2)}
              </p>
              <p style={{ color: "#888", fontSize: "0.78rem", marginTop: "0.2rem" }}>50% refund policy</p>
            </div>
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
              <button onClick={() => setCancelTarget(null)} style={s.secBtn}>Keep Ticket</button>
              <button onClick={handleCancel} disabled={cancelLoading}
                style={{ ...s.primBtn, background: "#e94560" }}>
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  heading: { fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.5rem" },
  toast: {
    position: "fixed", top: 20, right: 20, zIndex: 9999,
    background: "#1a1a2e", border: "1px solid #2a2a40",
    color: "#f0f0f0", padding: "0.75rem 1.2rem",
    borderRadius: 10, fontSize: "0.9rem", fontWeight: 600,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  form: { display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "2rem" },
  input: {
    padding: "0.75rem 1rem", borderRadius: "8px",
    border: "1px solid #2a2a40", background: "#12121f",
    color: "#f0f0f0", fontSize: "0.95rem", flex: 1, minWidth: "240px", outline: "none",
  },
  btn: {
    padding: "0.75rem 1.5rem", background: "#e94560", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer",
  },
  center: { display: "flex", justifyContent: "center", padding: "3rem 0" },
  spinner: {
    width: "36px", height: "36px", border: "3px solid #1e1e35",
    borderTop: "3px solid #e94560", borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  empty: { textAlign: "center", padding: "4rem 0" },
  count: { color: "#666", fontSize: "0.85rem", marginBottom: "1rem" },
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  card: {
    display: "flex", gap: "1.2rem", background: "#12121f",
    border: "1px solid #1e1e35", borderRadius: "12px",
    padding: "1.2rem", alignItems: "flex-start", position: "relative",
  },
  poster: { width: "70px", height: "100px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 },
  cardInfo: { flex: 1 },
  movieTitle: { fontSize: "1.05rem", fontWeight: "700", marginBottom: "0.5rem" },
  tags: { display: "flex", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" },
  tag: { padding: "0.2rem 0.6rem", border: "1px solid #2a2a40", borderRadius: "20px", fontSize: "0.78rem", color: "#aaa" },
  seatTag: {
    background: "rgba(124,58,237,0.2)", border: "1px solid #7c3aed",
    color: "#a78bfa", borderRadius: "6px",
    padding: "0.15rem 0.5rem", fontSize: "0.75rem", fontWeight: "700",
  },
  meta: { color: "#666", fontSize: "0.82rem", marginTop: "0.2rem" },
  actions: { display: "flex", gap: "0.6rem", marginTop: "0.8rem", flexWrap: "wrap" },
  editBtn: {
    padding: "0.35rem 0.9rem", background: "rgba(124,58,237,0.15)",
    border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa",
    borderRadius: "6px", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer",
  },
  cancelBtn: {
    padding: "0.35rem 0.9rem", background: "rgba(233,69,96,0.12)",
    border: "1px solid rgba(233,69,96,0.4)", color: "#e94560",
    borderRadius: "6px", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer",
  },
  statusBadge: {
    position: "absolute", top: "1rem", right: "1rem",
    borderRadius: "20px", padding: "0.2rem 0.7rem",
    fontSize: "0.72rem", fontWeight: "600",
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(4px)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem",
  },
  modal: {
    background: "#12121f", border: "1px solid #1e1e35",
    borderRadius: "16px", padding: "1.8rem",
    width: "100%", maxWidth: "400px",
  },
  modalTitle: { fontSize: "1.2rem", fontWeight: "800", color: "#fff", marginBottom: "0.5rem" },
  label: { fontSize: "0.82rem", color: "#aaa", fontWeight: "600", display: "block", marginBottom: "0.4rem" },
  secBtn: {
    padding: "0.6rem 1.2rem", background: "transparent",
    border: "1px solid #2a2a40", color: "#888",
    borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
  },
  primBtn: {
    padding: "0.6rem 1.4rem",
    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
    color: "#fff", border: "none", borderRadius: "8px",
    fontWeight: "700", fontSize: "0.9rem", cursor: "pointer",
  },
};
