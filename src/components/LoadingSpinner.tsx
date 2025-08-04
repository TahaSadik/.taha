import React from 'react'

// Lightweight loading spinner for lazy loading
const LoadingSpinner: React.FC<{ 
  size?: 'small' | 'medium' | 'large'
  message?: string 
}> = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-2 text-sm text-gray-400">{message}</p>
      )}
    </div>
  )
}

// Skeleton loading component for better UX
export const SkeletonLoader: React.FC<{
  className?: string
  count?: number
}> = ({ className = 'h-4 bg-gray-700 rounded', count = 1 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${className} ${index > 0 ? 'mt-2' : ''}`} />
      ))}
    </div>
  )
}

// Card skeleton for loading cards
export const CardSkeleton: React.FC = () => (
  <div className="border border-gray-700 rounded-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-700 rounded mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/2" />
    </div>
  </div>
)

export default LoadingSpinner