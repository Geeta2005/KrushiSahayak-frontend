import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), "");

  // Determine API base URL
  // In production (Vercel), use VITE_API_URL from environment
  // In development, use proxy to localhost:5000
  const apiBaseUrl = env.VITE_API_URL || "/api";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    assetsInclude: ["**/*.svg", "**/*.csv"],

    // Define env variables for client-side use
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(apiBaseUrl),
    },

    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
