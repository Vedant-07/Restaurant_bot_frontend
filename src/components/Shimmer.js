import React from 'react';

export default function Shimmer({ width = '100%', height = '16px', borderRadius = '4px' }) {
  return (
    <>
      <style>
        {`
          .shimmer {
            position: relative;
            background: #eee;
            overflow: hidden;
          }

          .shimmer::before {
            content: "";
            position: absolute;
            top: 0;
            left: -150%;
            width: 150%;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(255,255,255,0),
              rgba(255,255,255,0.6),
              rgba(255,255,255,0)
            );
            animation: shimmer 1.2s infinite;
          }

          @keyframes shimmer {
            0% { left: -150%; }
            100% { left: 150%; }
          }
        `}
      </style>
      <div
        className="shimmer"
        style={{ width, height, borderRadius, marginBottom: '8px' }}
      />
    </>
  );
}
