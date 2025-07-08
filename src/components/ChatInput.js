import React, { useState } from 'react';

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Ask e.g. 'i want to eat Chinese'"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        style={{ flex: 1, padding: '8px' }}
      />
      <button onClick={handleSubmit} style={{ padding: '8px 12px' }}>Send</button>
    </div>
  );
}
