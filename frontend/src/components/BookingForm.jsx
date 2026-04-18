import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import SeatGrid from "./SeatGrid";

const API = import.meta.env.VITE_API_URL || "/api";

export default function BookingForm({ movie, onSuccess }) {
  const { user } = useAuth();

  const showTimes = movie.showTimes?.length ? movie.showTimes : ["7:00 AM", "3:00 PM", "6:00 PM"];
  const showDates = movie.showDates?.length ? movie.showDates : [];
  const totalSeats = movie.availableSeats + 20;

  const [form, setForm] = useState({
    name:     user?.name  || "",
    email:    user?.email || "",
    showDate: showDates[0] || "",
    showTime: showTimes[0] || "",
  });
  const [selectedSeats, setSelectedSeats] = useState([]); // ["A1","B3",…]
  const [takenSeats, setTakenSeats]       = useState([]); // from backend
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");

  // Fetch real taken seats whenever date/time changes
  useEffect(() => {
    if (!form.showDate || !form.showTime) return;
    axios
      .get(`${API}/bookings/taken-seats`, {
        params: { movieId: movie._id, showDate: form.showDate, showTime: form.showTime },
      })
      .then((res) => setTakenSeats(res.data.takenSeats || []))
      .catch(() => setTakenSeats([]));
    // Clear selection when show changes
    setSelectedSeats([]);
  }, [form.showDate, form.showTime, movie._id]);

  const seatCount = selectedSeats.length;
  const total     = (seatCount * movie.price).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (seatCount === 0)    { setError("Please select at least one seat."); return; }
    if (!form.showDate)     { setError("Please select a show date."); return; }
    if (!form.showTime)     { setError("Please select a show time."); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, {
        ...form,
        movie:       movie._id,
        seats:       seatCount,
        seatNumbers: selectedSeats,
        totalPrice:  parseFloat(total),
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      <h3 style={s.heading}>🎟 Select Your Seats</h3>

      {/* Date picker */}
      <div style={s.field}>
        <label style={s.label}>📅 Show Date</label>
        {showDates.length > 0 ? (
          <div style={s.btnGroup}>
            {showDates.map((d) => (
              <button type="button" key={d}
                onClick={() => setForm({ ...form, showDate: d })}
                style={{ ...s.optBtn, ...(form.showDate === d ? s.optActive : {}) }}>
                {new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </button>
            ))}
          </div>
        ) : (
          <input name="showDate" type="date" value={form.showDate}
            onChange={(e) => setForm({ ...form, showDate: e.target.value })}
            required min={new Date().toISOString().split("T")[0]}
            style={{ ...s.input, maxWidth: "220px" }} />
        )}
      </div>

      {/* Time picker */}
      <div style={s.field}>
        <label style={s.label}>🕐 Show Time</label>
        <div style={s.btnGroup}>
          {showTimes.map((t) => (
            <button type="button" key={t}
              onClick={() => setForm({ ...form, showTime: t })}
              style={{ ...s.optBtn, ...(form.showTime === t ? s.optActive : {}) }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Seat grid */}
      <SeatGrid
        totalSeats={Math.min(totalSeats, 80)}
        takenSeats={takenSeats}
        selectedSeats={selectedSeats}
        onSelect={setSelectedSeats}
        maxSelect={Math.min(10, movie.availableSeats)}
      />

      <form onSubmit={handleSubmit} style={s.form}>
        {error && <div style={s.errorBox}>{error}</div>}

        <div style={s.row2}>
          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input name="name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required style={s.input} placeholder="Your name" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input name="email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required style={s.input} placeholder="your@email.com" />
          </div>
        </div>

        {/* Summary */}
        <div style={s.summary}>
          <div style={s.sRow}><span>Seats</span>
            <span style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {selectedSeats.length === 0
                ? <strong style={{ color: "#555" }}>None selected</strong>
                : selectedSeats.map((seat) => (
                    <span key={seat} style={s.seatTag}>{seat}</span>
                  ))}
            </span>
          </div>
          <div style={s.sRow}><span>Show time</span><strong>{form.showTime || "—"}</strong></div>
          <div style={s.sRow}><span>Show date</span><strong>{form.showDate || "—"}</strong></div>
          <div style={s.sRow}><span>Price / seat</span><strong>${movie.price}</strong></div>
          <div style={{ ...s.sRow, ...s.sTotal }}>
            <span>Total</span>
            <strong style={{ color: "#e94560", fontSize: "1.2rem" }}>${total}</strong>
          </div>
        </div>

        <button type="submit" disabled={loading || seatCount === 0}
          style={{ ...s.btn, opacity: seatCount === 0 ? 0.5 : 1 }}>
          {loading ? "Booking..." : `Confirm Booking — $${total}`}
        </button>
      </form>
    </div>
  );
}

const s = {
  wrapper: { marginTop: "2rem" },
  heading: { fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "#e94560" },
  form:    { display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" },
  row2:    { display: "flex", gap: "1rem", flexWrap: "wrap" },
  field:   { display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.8rem" },
  label:   { fontSize: "0.82rem", color: "#aaa", fontWeight: "600" },
  input: {
    padding: "0.7rem 0.9rem", borderRadius: "8px",
    border: "1px solid #2a2a40", background: "#0d0d1a",
    color: "#f0f0f0", fontSize: "0.95rem", outline: "none", width: "100%",
  },
  btnGroup: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  optBtn: {
    padding: "0.45rem 1rem", borderRadius: "20px",
    border: "1px solid #2a2a40", background: "transparent",
    color: "#888", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
  },
  optActive: {
    background: "#7c3aed", borderColor: "#7c3aed", color: "#fff",
    boxShadow: "0 2px 12px rgba(124,58,237,0.4)",
  },
  errorBox: {
    background: "#2a0a0f", border: "1px solid #e94560",
    color: "#ff6b6b", borderRadius: "8px", padding: "0.7rem 1rem", fontSize: "0.9rem",
  },
  summary: {
    background: "#12121f", border: "1px solid #1e1e35",
    borderRadius: "10px", padding: "1rem 1.2rem",
    display: "flex", flexDirection: "column", gap: "0.55rem",
  },
  sRow: { display: "flex", justifyContent: "space-between", alignItems: "center", color: "#aaa", fontSize: "0.88rem" },
  sTotal: { borderTop: "1px solid #2a2a40", paddingTop: "0.5rem", marginTop: "0.2rem", color: "#f0f0f0", fontSize: "1rem" },
  seatTag: {
    background: "rgba(124,58,237,0.2)", border: "1px solid #7c3aed",
    color: "#a78bfa", borderRadius: "6px",
    padding: "0.1rem 0.45rem", fontSize: "0.75rem", fontWeight: "700",
  },
  btn: {
    padding: "0.9rem", background: "#e94560", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "1rem",
    fontWeight: "700", cursor: "pointer", transition: "opacity 0.2s",
  },
};
