import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import ErrorBoundary from './ErrorBoundary'

// Lazy load route components for code splitting
const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Portfolio = lazy(() => import('../pages/Portfolio'))
const Contact = lazy(() => import('../pages/Contact'))

// Lazy load heavy components
const ProjectGallery = lazy(() => import('../components/ProjectGallery'))
const AnimatedHero = lazy(() => import('../components/AnimatedHero'))

// Wrapper component for lazy loading with error boundary
const LazyComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
)

// Optimized Routes with code splitting
export const LazyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <LazyComponent>
            <Home />
          </LazyComponent>
        } 
      />
      <Route 
        path="/about" 
        element={
          <LazyComponent>
            <About />
          </LazyComponent>
        } 
      />
      <Route 
        path="/portfolio" 
        element={
          <LazyComponent>
            <Portfolio />
          </LazyComponent>
        } 
      />
      <Route 
        path="/contact" 
        element={
          <LazyComponent>
            <Contact />
          </LazyComponent>
        } 
      />
    </Routes>
  )
}

// Hook for preloading routes on hover/interaction
export const usePreloadRoute = () => {
  const preloadRoute = (routeName: string) => {
    switch (routeName) {
      case 'about':
        import('../pages/About')
        break
      case 'portfolio':
        import('../pages/Portfolio')
        import('../components/ProjectGallery') // Preload heavy component
        break
      case 'contact':
        import('../pages/Contact')
        break
      default:
        break
    }
  }

  return preloadRoute
}

// Component for progressive enhancement
export const ProgressiveComponent: React.FC<{
  fallback: React.ComponentType
  component: React.ComponentType
  threshold?: number
}> = ({ fallback: Fallback, component: Component, threshold = 0.1 }) => {
  const [shouldLoad, setShouldLoad] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
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

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <Suspense fallback={<Fallback />}>
          <Component />
        </Suspense>
      ) : (
        <Fallback />
      )}
    </div>
  )
}

export default LazyRoutes