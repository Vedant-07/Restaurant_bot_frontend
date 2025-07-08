import React, { useState, useEffect } from 'react';
import MenuItemCard from './MenuItemCard';
import OrderSummary from './OrderSummary';
import ReviewList   from './ReviewList';

export default function RestaurantDetailPage({ restaurantId, onBack }) {
  const [menu,    setMenu]    = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart,    setCart]    = useState({});
  const [tab,     setTab]     = useState('menu'); // 'menu' or 'reviews'

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/restaurant/${restaurantId}`)
      .then(r => r.json())
      .then(data => {
        setMenu(data.menu);
        setReviews(data.reviews);
      })
      .catch(console.error);
  }, [restaurantId]);

  const updateQty = (itemId, delta) => {
    setCart(c => {
      const prev = c[itemId] || { ...menu.find(m => m.id === itemId), qty: 0 };
      const qty  = Math.max(0, prev.qty + delta);
      if (qty === 0) {
        const { [itemId]: _, ...rest } = c;
        return rest;
      }
      return { ...c, [itemId]: { ...prev, qty } };
    });
  };

  const handlePlaceOrder = async (orderType) => {
    // 1) Build items array from cart
    const items = Object.values(cart).map(i => ({
      menuItemId: i.id,
      name:       i.name,
      price:      i.price,
      quantity:   i.qty
    }));
  
    // 2) If delivery, prompt for address
    let address;
    if (orderType === 'delivery') {
      address = prompt("Enter your delivery address:");
      if (!address) {
        return alert("Order cancelled: address is required for delivery.");
      }
    }
  
    // 3) Prompt for email
    const email = prompt("Enter your email to confirm order:");
    if (!email) {
      return alert("Order cancelled: email is required.");
    }
  
    // 4) Send order to API
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          items,
          email,
          orderType,
          ...(orderType === 'delivery' ? { address } : {})
        })
      });
  
      const json = await res.json();
  
      if (res.ok) {
        alert(`✅ ${orderType.charAt(0).toUpperCase() + orderType.slice(1)} order placed!
  ID: ${json.orderId} – Status: ${json.status}`);

  setCart({});
      } else {
        alert(`❌ Error: ${json.error || 'Unknown error'}`);
      }
    } catch {
      alert("❌ Network error placing order.");
    }
  };
  

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Back to Results
      </button>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'2px solid #ddd', marginBottom: '20px' }}>
        {['menu','reviews'].map(t => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderBottom: tab===t ? '3px solid #007BFF' : 'none',
              color: tab===t ? '#007BFF' : '#555',
              fontWeight: tab===t ? 'bold': 'normal'
            }}
          >
            {t.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Always show order summary at bottom */}
      <div style={{ marginTop: '30px' }}>
        {/* <OrderSummary cart={cart} placeOrder={placeOrder} /> */}
        <OrderSummary cart={cart} onOrder={handlePlaceOrder} />
      </div>

      {/* Content */}
      {tab === 'menu' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '16px' }}>
          {menu.map(item => (
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
