import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    // Remove tsconfigPaths se não tiver certeza que funciona
    // tsconfigPaths: true,
    alias: {
      "@prisma/client/runtime/library": path.resolve(
        __dirname,
        "./__mocks__/prisma-runtime.js",
      ),
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["**/generated/**", "**/.prisma/**", "**/node_modules/**"],
  },
  optimizeDeps: {
    include: ["@prisma/client"],
    exclude: ["@prisma/client/runtime/library"], // Exclui o runtime do optimize
    entries: [], // Limpa entries conflitantes
  },
  ssr: {
    noExternal: ["@prisma/client"],
    external: ["@prisma/client/runtime/library"], // Externaliza o runtime específico
  },
});
