import React, { useState, useEffect } from "react";
import ChatLog from "./components/ChatLog";
import ChatInput from "./components/ChatInput";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetailPage from "./components/RestaurantDetailPage";
import OrderList from "./components/OrderList";
import ReservationList from "./components/ReservationList";

function App() {
  const [messages, setMessages] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [ordersList, setOrdersList] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [reservationsList, setReservationsList] = useState(null);
  const [showReservations, setShowReservations] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE;

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        from: "bot",
        text: "👋 Hi! You can ask me to find restaurants or view your orders and reservations.",
      },
    ]);
  }, []);

  // Watch for ManageOrders messages and update ordersList
  useEffect(() => {
    const mo = messages.find((m) => m.type === "ManageOrders");
    if (mo) {
      setOrdersList(mo.orders);
    }
  }, [messages]);

  // Post user message to backend
  const postChat = async (body) => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    return data;
  };

  // Handle user message send
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    try {
      const resp = await postChat({ message: text });
      handleChatResponse(resp, text);
    } catch {
      setMessages((m) => [...m, { from: "bot", text: "❌ Server error" }]);
    }
  };

  // Handle backend response
  const handleChatResponse = async (resp, lastText = "") => {
    if (resp.type === "AskEmail") {
      const email = prompt(
        `Please enter your email to look up your ${resp.object}:`
      );
      if (!email) {
        setMessages((m) => [...m, { from: "bot", text: "Email is required." }]);
        return;
      }
      const retry = await postChat({ message: lastText, email });
      return handleChatResponse(retry, lastText);
    }

    if (resp.type === "SearchRestaurant") {
      setRestaurants(resp.restaurants);
      setOrdersList(null);
      setMessages((m) => [
        ...m,
        { from: "bot", text: `Found ${resp.restaurants.length} restaurants.` },
      ]);
    } else if (resp.type === "ManageOrders") {
      setMessages((m) => [...m, { type: "ManageOrders", orders: resp.orders }]);
      setShowOrders(true);
      alert("💬 Click + or – to update the item's quantity.");
      setShowReservations(false);
    } else if (resp.type === "ManageReservations") {
      setReservationsList(resp.reservations);
      setShowReservations(true);
      setShowOrders(false);
    } else {
      setMessages((m) => [
        ...m,
        { from: "bot", text: resp.reply || "❌ I did not understand." },
      ]);
      setRestaurants([]);
      setOrdersList(null);
    }
  };

  // Change quantity (or remove if qty=0) , its for the orders
  const handleQuantityChange = async (orderId, itemId, newQty) => {
    // find the order
    const order = ordersList.find((o) => o.id === orderId);
    if (!order) return alert("Order not found");

    // build updated items[]
    let newItems;
    if (newQty <= 0) {
      // remove item
      newItems = order.items.filter((i) => i.menuItemId !== itemId);
    } else {
      newItems = order.items.map((i) =>
        i.menuItemId === itemId ? { ...i, quantity: newQty } : i
      );
    }

    // send patch
    const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: newItems }),
    });
    if (!res.ok) {
      const err = await res.json();
      return alert(`❌ ${err.error || res.statusText}`);
    }

    // update local state
    const updated = {
      ...order,
      items: newItems,
      total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
    setOrdersList((list) => list.map((o) => (o.id === orderId ? updated : o)));
    alert("✅ Order updated!");
  };

  // Cancel an order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("✅ Order cancelled");
      setOrdersList(ordersList.filter((o) => o.id !== orderId));
    } else {
      const err = await res.json();
      alert(`❌ Failed to cancel: ${err.error || res.statusText}`);
    }
  };

  // Make a reservation
  const onReserve = async (restaurantId) => {
    const name = prompt("Your name:");
    const email = prompt("Your email:");
    const dateTime = prompt(
      "Date & time (in ISO format, 24-hour clock):\n" +
        "Format: YYYY-MM-DDThh:mm\n" +
        "Examples:\n" +
        "  ➤ 2025-07-10T07:30  (7:30 AM)\n" +
        "  ➤ 2025-07-10T19:30  (7:30 PM)"
    );

    const partySize = prompt("Party size (number):");
    const specialRequests = prompt("Any special requests? (optional)") || "";

    if (!name || !email || !dateTime || !partySize) {
      alert(
        "Reservation cancelled: All fields except special requests are required."
      );
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          name,
          email,
          dateTime,
          partySize: Number(partySize),
          specialRequests,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(
          `✅ Reservation created! ID: ${data.reservationId} — Status: ${data.status}`
        );
      } else {
        alert(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network error creating reservation.");
    }
  };

  // Restaurant detail view toggle
  if (selectedRestaurantId) {
    return (
      <RestaurantDetailPage
        restaurantId={selectedRestaurantId}
        onBack={() => setSelectedRestaurantId(null)}
      />
    );
  }

  // PATCH immediately on any field change for the reservation
  const handleReservationChange = async (resId, updates) => {
    // updates may contain any of dateTime, partySize, specialRequests, status
    const res = await fetch(`${API_BASE}/api/reservations/${resId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      return alert(`❌ ${err.error || res.statusText}`);
    }
    alert("✅ Reservation updated!");
    // locally update
    setReservationsList((list) =>
      list.map((r) => (r.id === resId ? { ...r, ...updates } : r))
    );
  };

  // cancellation of reservation
  const handleDeleteReservation = async (resId) => {
    if (!window.confirm("Cancel this reservation?")) return;
    const res = await fetch(`${API_BASE}/api/reservations/${resId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("✅ Reservation cancelled");
      setReservationsList((list) => list.filter((r) => r.id !== resId));
    } else {
      const err = await res.json();
      alert(`❌ ${err.error || res.statusText}`);
    }
  };

  // Render main UI
  return (
    <div
      style={{ maxWidth: 600, margin: "20px auto", fontFamily: "sans-serif" }}
    >
      <h2>🍴 Restaurant Bot</h2>

      <ChatLog messages={messages} />
      <ChatInput onSend={sendMessage} />

      {/* If ordersList is non-null & showOrders: */}
      {ordersList && showOrders && (
        <>
          <button onClick={() => setShowOrders(false)} style={closeBtn}>
            Close Orders
          </button>

          <OrderList
            orders={ordersList}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDeleteOrder}
          />
        </>
      )}

      {/* Reservations */}
      {reservationsList && showReservations && (
        <>
          <button onClick={() => setShowReservations(false)} style={closeBtn}>
            Close Reservations
          </button>
          <ReservationList
            reservations={reservationsList}
            onChange={handleReservationChange}
            onDelete={handleDeleteReservation}
          />
        </>
      )}

      <RestaurantList
        restaurants={restaurants}
        onSelect={setSelectedRestaurantId}
        onReserve={onReserve}
        loading={loading}
      />
    </div>
  );
}

const closeBtn = {
  marginBottom: 12,
  background: "#888",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

export default App;
