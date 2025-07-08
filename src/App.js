import React, { useState, useEffect } from 'react';
import ChatLog           from './components/ChatLog';
import ChatInput         from './components/ChatInput';
import RestaurantList    from './components/RestaurantList';
import RestaurantDetailPage from './components/RestaurantDetailPage';

function App() {
  const [messages, setMessages]                 = useState([]);
  const [restaurants, setRestaurants]           = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE;

  // Persistent cache
  const [searchCache, setSearchCache] = useState(() => {
    try { return JSON.parse(localStorage.getItem('searchCache')) || {}; }
    catch { return {}; }
  });

  useEffect(() => {
    setMessages([{ from: 'bot', text: "👋 Hi! Ask me to find restaurants." }]);
  }, []);

  // 1) Called only for chat/search
  const postChat = async body => {
    console.log("searchig restaurants using CLU")
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
   console.log("CLU response:", data);
   return data;
  };

  // 2) Search handler (uses cache + postChat)
  const sendMessage = async text => {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: 'user', text }]);

    if (searchCache[text]) {
      handleSearchResponse(searchCache[text]);
      return;
    }

    try {
      const resp = await postChat({ message: text });
      if (resp.type === 'SearchRestaurant') {
        const updated = { ...searchCache, [text]: resp };
        setSearchCache(updated);
        localStorage.setItem('searchCache', JSON.stringify(updated));
      }
      handleSearchResponse(resp);
    } catch {
      setMessages(m => [...m, { from: 'bot', text: '❌ Server error' }]);
    }
  };

  const handleSearchResponse = resp => {
    if (resp.type === 'SearchRestaurant') {
      setRestaurants(resp.restaurants);
      setMessages(m => [...m, { from: 'bot', text: `Found ${resp.restaurants.length} restaurants.` }]);
    } else {
      setMessages(m => [...m, { from: 'bot', text: resp.reply || 'I did not understand.' }]);
      setRestaurants([]);
    }
  };

  // 3) Detail handler: fetch from dedicated REST endpoint
  const onSelectRestaurant = id => {
    setSelectedRestaurantId(id);
  };

  // If a restaurant is selected, render detail page
  if (selectedRestaurantId) {
    return (
      <RestaurantDetailPage
       restaurantId={selectedRestaurantId}
       onBack={() => setSelectedRestaurantId(null)}
      />
    );
  }

  const onReserve = async (restaurantId) => {
    const name   = prompt("Your name:");
    const email  = prompt("Your email:");
    const dateTime = prompt("Date & time (YYYY‑MM‑DDThh:mm):");
    const partySize = prompt("Party size (number):");
    const specialRequests = prompt("Any special requests? (optional)") || "";

    if (!name || !email || !dateTime || !partySize) {
      alert("Reservation cancelled: All fields except special requests are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId, name, email,
          dateTime, partySize: Number(partySize),
          specialRequests
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Reservation created! ID: ${data.reservationId} — Status: ${data.status}`);
      } else {
        alert(`❌ Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network error creating reservation.");
    }
  };

  // Main screen: chat + results
  return (
    <div style={{ maxWidth:600, margin:'20px auto', fontFamily:'sans-serif' }}>
      <h2>🍴 Restaurant Bot</h2>
      <ChatLog messages={messages} />
      <ChatInput onSend={sendMessage} />
      <RestaurantList
        restaurants={restaurants}
        onSelect={onSelectRestaurant}
        onReserve={onReserve}           
      />
    </div>
  );
}

export default App;
