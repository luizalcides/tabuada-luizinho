import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

function gitCommitShort(): string {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "dev";
  }
}

function buildDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default defineConfig({
  plugins: [react()],
  base: "./",
  define: {
    __APP_COMMIT__: JSON.stringify(gitCommitShort()),
    __APP_BUILD_DATE__: JSON.stringify(buildDate()),
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
