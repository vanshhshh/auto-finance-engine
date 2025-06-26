
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
