import React from 'react';

const Loading = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-blue-100 border-t-blue-600`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export const LoadingSkeleton = ({ rows = 3 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    ))}
  </div>
);

export default Loading;

