import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bs-card p-6 h-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
