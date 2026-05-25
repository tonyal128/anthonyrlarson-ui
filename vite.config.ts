import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    {
      name: "workaround-injected-head-scripts",
      resolveId(id) {
        if (id === "tanstack-start-injected-head-scripts:v") {
          return "\0" + id;
        }
      },
      load(id) {
        if (id === "\0tanstack-start-injected-head-scripts:v") {
          return 'export const injectedHeadScripts = ""';
        }
      },
    },
    tanstackStart(),
    devtools(),
    tailwindcss(),
    viteReact(),
  ],
});

export default config;
