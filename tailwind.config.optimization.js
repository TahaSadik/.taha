/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include any other file types that use Tailwind classes
    "./src/**/*.{vue,html,md}"
  ],
  
  theme: {
    extend: {
      // Only extend what you actually use
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Define only the colors you use
        gray: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          400: '#9ca3af',
          300: '#d1d5db',
        },
        indigo: {
          600: '#4f46e5',
          500: '#6366f1',
          400: '#818cf8',
        }
      },
      spacing: {
        // Only include custom spacing if needed
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        // Only include animations you use
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  
  plugins: [
    // Only include plugins you actually use
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class strategy to reduce CSS size
    }),
    
    // Custom plugin to add only needed utilities
    function({ addUtilities, theme, variants }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0,0,0,0.10)',
        },
        '.text-shadow-md': {
          textShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        },
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
  
  // Optimize for production
  corePlugins: {
    // Disable unused core plugins to reduce CSS size
    preflight: true, // Keep preflight for normalize styles
    container: true,
    accessibility: true,
    
    // Disable plugins you don't use
    float: false,
    clear: false,
    listStyleType: false,
    listStylePosition: false,
    placeholderColor: false,
    placeholderOpacity: false,
    verticalAlign: false,
    whitespace: false,
    wordBreak: false,
    resize: false,
    cursor: false,
    userSelect: false,
    pointerEvents: true, // Keep if you use pointer-events utilities
    
    // Keep only what you need
    aspectRatio: true,
    backdropBlur: true,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: true,
    backdropSaturate: false,
    backdropSepia: false,
  },
  
  // Further optimize for production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html',
    ],
    options: {
      // Safelist classes that might be added dynamically
      safelist: [
        'animate-spin',
        'animate-pulse',
        /^bg-(red|green|blue|yellow|indigo)-(100|200|300|400|500|600|700|800|900)$/,
        /^text-(red|green|blue|yellow|indigo)-(100|200|300|400|500|600|700|800|900)$/,
        /^border-(red|green|blue|yellow|indigo)-(100|200|300|400|500|600|700|800|900)$/,
      ],
      // Extract classes from attributes and content
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      // Clean up CSS
      variables: true,
      keyframes: true,
    }
  },
  
  // Experimental features for better optimization
  experimental: {
    optimizeUniversalDefaults: true,
  },
  
  // Future flags for better tree-shaking
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true
  }
}