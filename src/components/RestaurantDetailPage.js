import React, { useState, useEffect } from "react";
import MenuItemCard from "./MenuItemCard";
import OrderSummary from "./OrderSummary";
import ReviewList from "./ReviewList";
import PaymentModal from "./PaymentModal";

export default function RestaurantDetailPage({ restaurantId, onBack }) {
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState({});
  const [tab, setTab] = useState("menu"); // 'menu' or 'reviews'
  const [showPayment, setShowPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE}/api/restaurant/${restaurantId}`)
      .then((r) => r.json())
      .then((data) => {
        setMenu(data.menu);
        setReviews(data.reviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false)); 
  }, [restaurantId]);

  const updateQty = (itemId, delta) => {
    setCart((c) => {
      const prev = c[itemId] || {
        ...menu.find((m) => m.id === itemId),
        qty: 0,
      };
      const qty = Math.max(0, prev.qty + delta);
      if (qty === 0) {
        const { [itemId]: _, ...rest } = c;
        return rest;
      }
      return { ...c, [itemId]: { ...prev, qty } };
    });
  };

  const handlePlaceOrder = (orderType) => {
    const items = Object.values(cart).map((i) => ({
      menuItemId: i.id,
      name: i.name,
      price: i.price,
      quantity: i.qty,
    }));

    // Gather address if needed
    let address;
    if (orderType === "delivery") {
      address = prompt("Enter your delivery address:");
      if (!address) return alert("Address is required for delivery.");
    }

    const email = prompt("Enter your email:");
    if (!email) return alert("Email is required.");

    // Store pending order
    setPendingOrder({ orderType, items, email, address });
    // Show payment modal
    setShowPayment(true);
  };

  // This runs after successful payment
  const finalizeOrder = async () => {
    const { orderType, items, email, address } = pendingOrder;
    setShowPayment(false);
    // Call api for order
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          items,
          email,
          orderType,
          ...(orderType === "delivery" ? { address } : {}),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        alert(
          `✅ Order placed! ID: ${json.orderId} — ${orderType} — Status: ${json.status}`
        );
        setCart({}); // empty the cart
      } else {
        alert(`❌ ${json.error || "Failed to place order."}`);
      }
    } catch {
      alert("❌ Network error.");
    }
    setPendingOrder(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <button onClick={onBack} style={{ marginBottom: "20px" }}>
        ← Back to Results
      </button>

      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #ddd",
          marginBottom: "20px",
        }}
      >
        {["menu", "reviews"].map((t) => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderBottom: tab === t ? "3px solid #007BFF" : "none",
              color: tab === t ? "#007BFF" : "#555",
              fontWeight: tab === t ? "bold" : "normal",
            }}
          >
            {t.toUpperCase()}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <OrderSummary cart={cart} onOrder={handlePlaceOrder} />

        {showPayment && pendingOrder && (
          <PaymentModal
            total={pendingOrder.items.reduce(
              (s, i) => s + i.price * i.quantity,
              0
            )}
            onCancel={() => setShowPayment(false)}
            onSuccess={finalizeOrder}
          />
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>
          Loading...
        </div>
      ) : tab === "menu" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
            gap: "16px",
          }}
        >
          {menu.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              qty={cart[item.id]?.qty || 0}
              onIncrement={() => updateQty(item.id, +1)}
              onDecrement={() => updateQty(item.id, -1)}
            />
          ))}
        </div>
      ) : (
        <ReviewList reviews={reviews} />
      )}
    </div>
  );
}
