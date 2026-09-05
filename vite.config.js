import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {fileURLToPath, URL} from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");

  return {
    base: env.VITE_BASE_PATH || "/",
    resolve: {
      alias: {
        "@app": fileURLToPath(new URL("./src", import.meta.url)),
        "@features": fileURLToPath(new URL("./src/pages", import.meta.url)),
        "@shared": fileURLToPath(new URL("./src", import.meta.url)),
        "@content": fileURLToPath(new URL("./src/content", import.meta.url)),
        "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  };
});
