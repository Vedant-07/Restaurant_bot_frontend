// src/components/PaymentModal.jsx
import React, { useState } from "react";

export default function PaymentModal({ total, onCancel, onSuccess }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    if (!cardNumber || !expiry || !cvv) {
      return alert("Please fill all card details.");
    }
    setProcessing(true);
    // Mock delay
    setTimeout(() => {
      setProcessing(false);
      onSuccess(); // proceed with placing order
    }, 1500);
  };

  return (
    <div style={backdrop}>
      <div style={modalStyle}>
        <h3>Mock Payment</h3>
        <div style={{ marginBottom: 8 }}>
          <strong>Amount:</strong> ₹{total}
        </div>
        <input
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="CVV"
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          style={inputStyle}
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <button onClick={onCancel} disabled={processing} style={btnCancel}>
            Cancel
          </button>
          <button onClick={handlePay} disabled={processing} style={btnPay}>
            {processing ? "Processing…" : "Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}

const backdrop = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 300,
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "95%",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: 4,
  border: "1px solid #ccc",
};

const btnCancel = {
  padding: "8px 12px",
  background: "#ccc",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const btnPay = {
  padding: "8px 12px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
