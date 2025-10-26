import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin to inject environment variables into index.html at build time
const htmlEnvInjector = (): Plugin => ({
  name: 'html-env-injector',
  transformIndexHtml(html, ctx) {
    // Only run during build, not dev server
    if (ctx.server) return html;
    
    const backendUrl = process.env.VITE_BACKEND_URL || '';
    return html.replace('__VITE_BACKEND_URL__', backendUrl);
  }
});



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
      htmlEnvInjector(), // Inject env vars into index.html
      mode === 'development' && componentTagger(), // Dev-only Lovable tagger.
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});