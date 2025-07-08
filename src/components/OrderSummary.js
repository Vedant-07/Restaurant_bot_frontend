import React from "react";

export default function OrderSummary({ cart, onOrder }) {
  const items = Object.values(cart);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div style={{ padding: "16px", color: "#777" }}>Your cart is empty</div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h4>Order Summary</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((i) => (
          <li key={i.id} style={{ marginBottom: "8px" }}>
            {i.name} x {i.qty} = ₹{i.price * i.qty}
          </li>
        ))}
      </ul>
      <hr />
      <div style={{ fontWeight: "bold", margin: "8px 0" }}>Total: ₹{total}</div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => onOrder("delivery")} style={btnStyle}>
          🚚 Delivery
        </button>
        <button onClick={() => onOrder("pickup")} style={btnStyle}>
          🛍️ Pickup
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  flex: 1,
  padding: "12px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
