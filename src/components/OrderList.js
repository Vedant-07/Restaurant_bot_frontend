// src/components/OrderList.jsx
import React from "react";

export default function OrderList({ orders, onQuantityChange, onDelete }) {
  return (
    <div style={{ padding: 16 }}>
      <h4>Your Orders</h4>
      {orders.map((o) => (
        <div key={o.id} style={card}>
          <div style={{ marginBottom: 8 }}>
            {new Date(o.placedAt).toLocaleString()}
          </div>
          <div style={{ marginBottom: 8 }}>
            ₹{o.total} &middot; {o.status} &middot; {o.orderType}
          </div>

          {/* Inline item list with − / + */}
          <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 8 }}>
            {o.items.map((item) => (
              <li key={item.menuItemId} style={itemRow}>
                <span>{item.name}</span>
                <div>
                  <button
                    onClick={() =>
                      onQuantityChange(o.id, item.menuItemId, item.quantity - 1)
                    }
                    style={qtyBtn}
                    disabled={item.quantity === 0}
                  >
                    −
                  </button>
                  <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                  <button
                    onClick={() =>
                      onQuantityChange(o.id, item.menuItemId, item.quantity + 1)
                    }
                    style={qtyBtn}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onDelete(o.id)}
            style={{ ...btn, background: "#dc3545" }}
          >
            Cancel Order
          </button>
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
};
const btn = {
  padding: "6px 12px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
};
const qtyBtn = {
  width: 24,
  height: 24,
  borderRadius: 4,
  border: "1px solid #aaa",
  background: "white",
  cursor: "pointer",
};
