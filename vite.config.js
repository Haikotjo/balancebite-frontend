import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(), // Alleen de React plugin blijft
  ],
  build: {
    sourcemap: false, // Disable source maps during the build
  },
});
