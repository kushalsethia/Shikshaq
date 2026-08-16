import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    // Defaults to 8080; PORT lets a second dev server run alongside the first.
    port: Number(process.env.PORT) || 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for mobile devices
    target: 'es2015', // Support older devices
    minify: 'esbuild', // Faster than terser
    cssMinify: true,
    rollupOptions: {
      output: {
        // Add hash to filenames for cache busting
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        // Manual chunk splitting for better code splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-toast',
          ],
          'supabase-vendor': ['@supabase/supabase-js'],
          // Split out libs that are pulled into the eager main bundle (used by
          // components imported directly in App.tsx / Index.tsx) so they cache
          // independently from app code and fetch in parallel over HTTP/2.
          'motion-vendor': ['framer-motion'],
          'dompurify-vendor': ['dompurify'],
          'search-vendor': ['fuse.js'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
