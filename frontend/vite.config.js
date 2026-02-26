import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // You can inline the manifest here, but pointing at the public file is fine:
      manifest: {
        name: "Tabit",
        short_name: "Tabit",
        start_url: "/",
        display: "standalone",
        background_color: "#0B0B0C",
        theme_color: "#0B0B0C",
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
