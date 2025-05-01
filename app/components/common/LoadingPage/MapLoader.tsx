'use client';
import React from 'react';

const MapLoader = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 12px',
          animation: 'rotate 3s linear infinite',
        }}
      >
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
          <circle cx='50' cy='50' r='45' fill='#42a5f5' />
          <path
            d='M50 5A45 45 0 0 1 95 50'
            stroke='#fff'
            strokeWidth='2'
            fill='none'
          />
          <path
            d='M50 95A45 45 0 0 1 5 50'
            stroke='#fff'
            strokeWidth='2'
            fill='none'
          />
          <path
            d='M50 15A35 35 0 0 1 85 50'
            stroke='#66bb6a'
            strokeWidth='2'
            fill='none'
          />
          <path
            d='M50 85A35 35 0 0 1 15 50'
            stroke='#66bb6a'
            strokeWidth='2'
            fill='none'
          />
          <circle
            cx='50'
            cy='50'
            r='35'
            fill='none'
            stroke='#fff'
            strokeWidth='1'
          />
        </svg>
      </div>
      <p
        style={{
          color: '#333',
          fontSize: '14px',
          fontWeight: '500',
          margin: 0,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      >
        Loading map...
      </p>

      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MapLoader;
