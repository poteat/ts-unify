import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
  },
  define: {
    "process.env": {},
    "process.cwd": "(() => '/')",
    "process.argv": "[]",
  },
});
