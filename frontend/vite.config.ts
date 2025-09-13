import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../");
  const isProduction = env.VITE_CLIENT_ENV === "production";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envDir: "../",
    root: "./",
    server: {
      port: isProduction ? 3000 : 5173,
    },
  };
});
