import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const getSizeStyles = (size) => {
    switch(size) {
      case 'sm': return { width: '1rem', height: '1rem' };
      case 'md': return { width: '2rem', height: '2rem' };
      case 'lg': return { width: '3rem', height: '3rem' };
      case 'xl': return { width: '4rem', height: '4rem' };
      default: return { width: '2rem', height: '2rem' };
    }
  };

  const getColorStyles = (color) => {
    switch(color) {
      case 'primary': return '#3b82f6';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      case 'pink': return '#ec4899';
      case 'white': return '#ffffff';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin"
        style={{
          ...getSizeStyles(size),
          border: '4px solid transparent',
          borderTop: `4px solid ${getColorStyles(color)}`,
          borderRadius: '50%'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;