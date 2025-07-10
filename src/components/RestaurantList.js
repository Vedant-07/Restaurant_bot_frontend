import React from "react";
import Shimmer from "./Shimmer";

export default function RestaurantList({
  restaurants,
  onSelect,
  onReserve,
  loading,
}) {
  return (
    <div>
      <h4 style={{ marginBottom: "16px", color: "#444" }}>
        🍽️ Found Restaurants:
      </h4>

      {loading && (
        <>
          <Shimmer width="60%" height={24} />
          <Shimmer width="100%" height={12} />
          <Shimmer width="80%" height={12} />
        </>
      )}

      {restaurants.map((r) => (
        <div key={r.id} style={cardStyle}>
          <h5 style={{ margin: "0 0 4px 0", fontSize: "18px" }}>
            <strong>{r.name}</strong>{" "}
            <span style={{ fontWeight: "normal", color: "#888" }}>
              ({r.rate}⭐ / {r.votes} votes)
            </span>
          </h5>

          <div style={{ marginBottom: "4px", color: "#555" }}>
            📍 <strong>{r.location}</strong> — {r.address}
          </div>
          <div style={{ marginBottom: "4px", color: "#555" }}>
            📞 {r.phone} | 💰 ₹{r.cost} for 2 | 🛵 Online order:{" "}
            {r.online_order ? "Yes" : "No"}
          </div>

          <div style={{ margin: "6px 0" }}>
            <strong>Cuisines:</strong>{" "}
            {r.cuisines && r.cuisines.length > 0 ? (
              r.cuisines.map((cuisine, idx) => (
                <span key={idx} style={cuisineChip}>
                  {cuisine}
                </span>
              ))
            ) : (
              <span style={{ color: "#888" }}>Not specified</span>
            )}
          </div>

          <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
            <button onClick={() => onSelect(r.id)} style={blueBtn}>
              View Menu & Reviews
            </button>

            {onReserve && r.book_table && (
              <button onClick={() => onReserve(r.id)} style={greenBtn}>
                Reserve Table
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Styles
const cardStyle = {
  marginBottom: "16px",
  padding: "14px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  backgroundColor: "#fafafa",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const cuisineChip = {
  display: "inline-block",
  backgroundColor: "#e0f7fa",
  color: "#00796b",
  borderRadius: "12px",
  padding: "2px 8px",
  marginRight: "6px",
  marginTop: "4px",
  fontSize: "13px",
};

const blueBtn = {
  padding: "6px 12px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const greenBtn = {
  padding: "6px 12px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
