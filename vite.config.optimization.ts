import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { compressionPlugin } from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html for bundle analysis
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
    // Gzip compression
    compressionPlugin({
      algorithm: 'gzip'
    }),
    // Brotli compression (better than gzip)
    compressionPlugin({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  
  build: {
    // Enable source maps for production debugging (remove for smaller builds)
    sourcemap: false,
    
    // Optimize CSS
    cssCodeSplit: true,
    
    // Rollup optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for React ecosystem
          react: ['react', 'react-dom'],
          
          // Router chunk
          router: ['react-router-dom'],
          
          // Animation library chunk (can be lazy loaded)
          animations: ['framer-motion'],
          
          // Utility libraries
          utils: ['lucide-react']
        },
        
        // Optimize chunk file names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            return 'js/[name]-[hash].js'
          }
          return 'js/[name]-[hash].js'
        },
        
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${extType}`
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${extType}`
          }
          
          return `assets/[name]-[hash].${extType}`
        }
      }
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    
    // Optimize for modern browsers
    target: 'es2015',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: [
      // Exclude heavy libraries that should be code-split
      'framer-motion'
    ]
  },
  
  // CSS optimization
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        // Add PostCSS plugins for optimization
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  }
})