import React from "react";

export default function ReservationList({ reservations, onChange, onDelete }) {
  return (
    <div style={{ padding: 16 }}>
      <h4>Your Reservations</h4>
      {reservations.map((r) => (
        <div key={r.id} style={card}>
          <div>
            <strong>{new Date(r.dateTime).toLocaleString()}</strong> for{" "}
            {r.partySize} people
          </div>
          <div>
            Special Request:
            <em>{r.specialRequests || "No special requests"}</em>
          </div>
          <div>
            Status: <strong>{r.status}</strong>
          </div>

          {/* Controls: adjust partySize and dateTime */}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => {
                const newSize = parseInt(
                  prompt("New party size:", r.partySize),
                  10
                );
                if (newSize > 0) onChange(r.id, { partySize: newSize });
              }}
              style={btn}
            >
              Change Party Size
            </button>
            <button
              onClick={() => {
                const newDT = prompt(
                  "Date & time (in ISO format, 24-hour clock):\n" +
                    "Format: YYYY-MM-DDThh:mm\n" +
                    "Examples:\n" +
                    "  ➤ 2025-07-10T07:30  (7:30 AM)\n" +
                    "  ➤ 2025-07-10T19:30  (7:30 PM)",
                  new Date(r.dateTime).toISOString().slice(0, 16)
                );

                if (newDT)
                  onChange(r.id, { dateTime: new Date(newDT).toISOString() });
              }}
              style={btn}
            >
              Change Date/Time
            </button>
            <button
              onClick={() => {
                const newReq = prompt("Special requests:", r.specialRequests);
                onChange(r.id, { specialRequests: newReq || "" });
              }}
              style={btn}
            >
              Edit Requests
            </button>
            <button
              onClick={() => onDelete(r.id)}
              style={{ ...btn, background: "#dc3545" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  background: "#fafafa",
};
const btn = {
  marginRight: 8,
  marginTop: 4,
  padding: "6px 10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: "0.9em",
};
