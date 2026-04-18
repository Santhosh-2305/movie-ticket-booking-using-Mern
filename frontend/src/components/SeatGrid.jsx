// Cinema-style seat selection grid
// Props:
//   totalSeats   — total capacity
//   takenSeats   — array of seat labels already booked e.g. ["A1","B3"]
//   selectedSeats — array of currently selected seat labels
//   onSelect     — callback(updatedSelectedLabels[])
//   maxSelect    — max seats user can pick

const COLS = 10;
const rowLabel = (i) => String.fromCharCode(65 + i); // A, B, C…
const seatLabel = (row, col) => `${rowLabel(row)}${col + 1}`;

export default function SeatGrid({
  totalSeats = 60,
  takenSeats = [],
  selectedSeats = [],
  onSelect,
  maxSelect = 10,
}) {
  const rows = Math.ceil(totalSeats / COLS);

  const toggle = (label) => {
    if (takenSeats.includes(label)) return;
    if (selectedSeats.includes(label)) {
      onSelect(selectedSeats.filter((s) => s !== label));
    } else {
      if (selectedSeats.length >= maxSelect) return;
      onSelect([...selectedSeats, label]);
    }
  };

  const getStatus = (label) => {
    if (takenSeats.includes(label)) return "taken";
    if (selectedSeats.includes(label)) return "selected";
    return "available";
  };

  return (
    <div style={s.wrapper}>
      {/* Screen */}
      <div style={s.screenWrap}>
        <div style={s.screen} />
        <p style={s.screenLabel}>SCREEN</p>
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {Array.from({ length: rows }, (_, rowIdx) => (
          <div key={rowIdx} style={s.row}>
            <span style={s.rowLabel}>{rowLabel(rowIdx)}</span>
            <div style={s.seats}>
              {Array.from({ length: COLS }, (_, colIdx) => {
                const seatNum = rowIdx * COLS + colIdx + 1;
                if (seatNum > totalSeats) return <div key={colIdx} style={s.placeholder} />;
                const label = seatLabel(rowIdx, colIdx);
                const status = getStatus(label);
                return (
                  <button
                    key={colIdx}
                    type="button"
                    onClick={() => toggle(label)}
                    title={label}
                    disabled={status === "taken"}
                    style={{
                      ...s.seat,
                      ...(status === "taken"    ? s.seatTaken    : {}),
                      ...(status === "selected" ? s.seatSelected : {}),
                      ...(status === "available"? s.seatAvailable: {}),
                    }}
                  >
                    {colIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={s.legend}>
        {[
          { style: s.seatAvailable, label: "Available" },
          { style: s.seatSelected,  label: "Selected"  },
          { style: s.seatTaken,     label: "Taken"     },
        ].map(({ style, label }) => (
          <div key={label} style={s.legendItem}>
            <div style={{ ...s.legendBox, ...style }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {selectedSeats.length > 0 && (
        <div style={s.selectionInfo}>
          <span>Selected: </span>
          {selectedSeats.map((seat) => (
            <span key={seat} style={s.seatTag}>{seat}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  wrapper: { width: "100%", overflowX: "auto" },
  screenWrap: { textAlign: "center", marginBottom: "1.5rem" },
  screen: {
    height: "8px",
    background: "linear-gradient(90deg, transparent, #e94560, transparent)",
    borderRadius: "50%", margin: "0 auto", maxWidth: "500px",
    boxShadow: "0 4px 20px rgba(233,69,96,0.4)",
  },
  screenLabel: { color: "#666", fontSize: "0.75rem", letterSpacing: "4px", marginTop: "0.4rem" },
  grid: { display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" },
  row: { display: "flex", alignItems: "center", gap: "6px" },
  rowLabel: { width: "18px", color: "#555", fontSize: "0.75rem", textAlign: "right", flexShrink: 0 },
  seats: { display: "flex", gap: "5px" },
  seat: {
    width: "30px", height: "28px", borderRadius: "5px 5px 3px 3px",
    border: "none", fontSize: "0.6rem", fontWeight: "600", cursor: "pointer",
    transition: "transform 0.1s, background 0.15s",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  seatAvailable: { background: "#1e1e35", color: "#888" },
  seatSelected:  { background: "#7c3aed", color: "#fff", transform: "scale(1.12)", boxShadow: "0 2px 8px rgba(124,58,237,0.5)" },
  seatTaken:     { background: "#2a2a2a", color: "#3a3a3a", cursor: "not-allowed" },
  placeholder:   { width: "30px", height: "28px" },
  legend: { display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "1.2rem", flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#aaa" },
  legendBox: { width: "18px", height: "16px", borderRadius: "3px" },
  selectionInfo: {
    display: "flex", flexWrap: "wrap", alignItems: "center",
    gap: "0.4rem", marginTop: "0.8rem",
    color: "#aaa", fontSize: "0.85rem",
  },
  seatTag: {
    background: "rgba(124,58,237,0.2)", border: "1px solid #7c3aed",
    color: "#a78bfa", borderRadius: "6px",
    padding: "0.15rem 0.5rem", fontSize: "0.78rem", fontWeight: "700",
  },
};
