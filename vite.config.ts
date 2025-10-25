import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";



export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: "::", // IPv6-tolerant; toggle to 'localhost' for isolation.
      port: 5173, // Vite default
      cors: true, // Enable CORS for cross-origin backend requests
      // No proxy needed - axios uses VITE_BACKEND_URL directly
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
  };
});