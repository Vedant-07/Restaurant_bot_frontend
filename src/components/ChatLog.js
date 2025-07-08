import React from 'react';

export default function ChatLog({ messages }) {
  return (
    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', height: '300px', overflowY: 'auto' }}>
      {messages.map((msg, idx) => (
        <div key={idx} style={{ textAlign: msg.from === 'bot' ? 'left' : 'right', margin: '4px 0' }}>
          <b>{msg.from === 'bot' ? 'Bot' : 'You'}:</b> {msg.text}
        </div>
      ))}
    </div>
  );
}
