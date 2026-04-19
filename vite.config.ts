import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Pake Babel, bukan SWC
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Biar gampang dibuka di browser HP
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    // componentTagger sudah dihapus biar bersih dari jejak Lovable
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));