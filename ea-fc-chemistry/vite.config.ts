import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'EA FC 25 Squad Builder',
        short_name: 'Squad Builder',
        description: 'Build your perfect EA FC 25 Ultimate Team squad',
        theme_color: '#1a472a',
        background_color: '#1a472a',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.gaming-tools\.co\.uk\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240 // Only compress files larger than 10KB
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React vendor chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI component library chunk
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-slider'
          ],
          // DnD chunk
          'dnd-vendor': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities'
          ],
          // Utility libraries chunk
          'utils': ['fuse.js', 'zustand', 'lz-string']
        }
      }
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'fuse.js'
    ]
  },
  server: {
    port: 3000,
    strictPort: false,
    open: true
  },
  preview: {
    port: 3000,
    strictPort: false
  }
});

