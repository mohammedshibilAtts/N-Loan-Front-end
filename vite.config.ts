import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  // Vite options tailored for Tauri development
  clearScreen: false,

  server: {
    port: 1421,
    strictPort: true,
    host: host || true, // Accept connections from network (0.0.0.0)

    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,

    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
