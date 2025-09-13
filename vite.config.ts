import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";



export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // IPv6-tolerant; toggle to 'localhost' for isolation.
    port: 5173, // Vite default; avoids 8080 port mismatch in browsers/SW.
    cors: mode === 'development' ? true : false, // Dev: Allows localhost origins; secure, no * wildcard.
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL, // Backend base; HTTP for dev.
        changeOrigin: true, // Rewrites Host header for auth/cookies.
        secure: false, // Disables TLS check for localhost HTTP.
        rewrite: (path) => path.replace(/^\/api/, ''), // Strips /api; backend sees /auth/login.
        configure: (proxy, options) => {
          // Logs proxy flow; remove in prod.
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.getHeader('host')}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error(`[Proxy Error] ${err.message} for ${req.url}`);
          });
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(), // Dev-only Lovable tagger.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));