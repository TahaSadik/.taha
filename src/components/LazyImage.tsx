import React, { useState, useRef, useEffect } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholderSrc?: string
  onLoad?: () => void
  onError?: () => void
  threshold?: number
  blurDataURL?: string
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderSrc,
  onLoad,
  onError,
  threshold = 0.1,
  blurDataURL
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  const getPlaceholder = () => {
    if (blurDataURL) {
      return blurDataURL
    }
    if (placeholderSrc) {
      return placeholderSrc
    }
    // Generate a simple placeholder data URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD48L3N2Zz4='
  }

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-700 text-gray-400`}>
        <span>Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder */}
      <img
        ref={imgRef}
        src={getPlaceholder()}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: blurDataURL ? 'blur(20px)' : 'none' }}
      />
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} absolute inset-0 transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  )
}

// Hook for lazy loading any component
export const useLazyComponent = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Progressive image component for better UX
export const ProgressiveImage: React.FC<{
  src: string
  lowQualitySrc: string
  alt: string
  className?: string
}> = ({ src, lowQualitySrc, alt, className = '' }) => {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false)
  const { ref, isInView } = useLazyComponent()

  return (
    <div ref={ref as any} className={`relative ${className}`}>
      {/* Low quality image (always visible) */}
      <img
        src={lowQualitySrc}
        alt={alt}
        className={`${className} transition-all duration-500 ${
          isHighQualityLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        }`}
        style={{ filter: 'blur(5px)' }}
      />
      
      {/* High quality image (loads when in view) */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} absolute inset-0 transition-opacity duration-500 ${
            isHighQualityLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsHighQualityLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  )
}

export default LazyImage