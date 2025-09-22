import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm dark:bg-slate-800 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
};

export default Card;