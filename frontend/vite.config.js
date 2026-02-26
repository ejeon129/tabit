import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // You can inline the manifest here, but pointing at the public file is fine:
      manifest: {
        name: "Tabit",
        short_name: "Tabit",
        start_url: "/",
        display: "standalone",
        background_color: "#f3f6fb",
        theme_color: "#0b5f59",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [
          // Cache audio responses a bit to avoid re-downloads on back/forward
          {
            urlPattern: ({ request }) => request.destination === "audio",
            handler: "NetworkFirst",
            options: { cacheName: "audio-cache" }
          }
        ]
      }
    })
  ],
  // optional: if you use a proxy to Flask, keep it here:
  server: {
    proxy: {
      "/transcribe": "http://127.0.0.1:5000"
    }
  }
});
