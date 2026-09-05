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
        "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
        "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
        "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
        "@content": fileURLToPath(new URL("./src/content", import.meta.url)),
        "@integrations": fileURLToPath(new URL("./src/integrations", import.meta.url)),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  };
});
