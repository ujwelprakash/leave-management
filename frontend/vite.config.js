import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ ESM style
export default defineConfig({
  plugins: [react()],
});
