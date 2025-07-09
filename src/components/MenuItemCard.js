import React from 'react';

export default function MenuItemCard({ item, qty, onIncrement, onDecrement }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      textAlign: 'center',
      padding: '8px'
    }}>
      <img
        src={item.imageUrl || 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg'}
        alt={item.name}
        style={{ width: '100%', height: 100, objectFit: 'cover' }}
      />
      <div style={{ margin: '8px 0', fontWeight: 'bold' }}>{item.name}</div>
      <div style={{ marginBottom: '8px' }}>₹{item.price}</div>
      <div>
        <button onClick={onDecrement} style={qty>0?btnStyle:disabledBtnStyle}>–</button>
        <span style={{ margin: '0 8px' }}>{qty}</span>
        <button onClick={onIncrement} style={btnStyle}>+</button>
      </div>
    </div>
  );
}

const btnStyle = {
  width: 28, height: 28, borderRadius: 14,
  border: '1px solid #888', background: '#fff', cursor: 'pointer'
};

const disabledBtnStyle = {
  ...btnStyle,
  opacity: 0.3,
  cursor: 'not-allowed'
};
