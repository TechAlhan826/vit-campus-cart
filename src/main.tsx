import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@/lib/axios' // Initialize axios interceptors

// DISABLE service worker for now - it's breaking API proxying
// Service worker intercepts /api calls and breaks Vite dev proxy
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister ALL service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('Service worker unregistered');
      }
    } catch (error) {
      console.error('SW unregister failed:', error);
    }
  });
}

// TODO: Re-enable service worker only for production build
// if ('serviceWorker' in navigator && import.meta.env.PROD) {
//   window.addEventListener('load', async () => {
//     const registration = await navigator.serviceWorker.register('/sw.js');
//     console.log('SW registered:', registration);
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
