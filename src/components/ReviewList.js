import React from 'react';

export default function ReviewList({ reviews }) {
  if (!reviews.length) {
    return <div style={{ padding: '16px', color: '#777' }}>No reviews yet.</div>;
  }
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <h4>Customer Reviews</h4>
      {reviews.map((r,i) => (
        <div key={i} style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold' }}>{r.rating}/5</div>
          <div style={{ color: '#555' }}>{r.text}</div>
        </div>
      ))}
    </div>
  );
}
