import React from 'react';

export default function MenuItemCard({ item, qty, onIncrement, onDecrement }) {
  return (
    <div style={cardStyle}>
      <img
        src={item.imageUrl || 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg'}
        alt={item.name}
        style={imageStyle}
      />

      <div style={contentContainer}>
        <div>
          <div style={{ margin: '8px 0', fontWeight: 'bold' }}>{item.name}</div>

          <div style={descriptionStyle}>
            {item.description || `${item.name} is prepared from fresh ingredients.`}
          </div>
        </div>

        <div style={bottomRowStyle}>
          <div style={{ fontWeight: 'bold' }}>₹{item.price}</div>
          <div>
            <button onClick={onDecrement} style={qty > 0 ? btnStyle : disabledBtnStyle}>–</button>
            <span style={{ margin: '0 8px' }}>{qty}</span>
            <button onClick={onIncrement} style={btnStyle}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden',
  padding: '0',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  height: '260px',
  backgroundColor: '#fff',
};

const imageStyle = {
  width: '100%',
  height: 100,
  objectFit: 'cover'
};

const contentContainer = {
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
};

const descriptionStyle = {
  fontSize: '13px',
  color: '#555',
  marginBottom: '8px',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
};

const bottomRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
};

const btnStyle = {
  width: 28,
  height: 28,
  borderRadius: 14,
  border: '1px solid #888',
  background: '#fff',
  cursor: 'pointer'
};

const disabledBtnStyle = {
  ...btnStyle,
  opacity: 0.3,
  cursor: 'not-allowed'
};
