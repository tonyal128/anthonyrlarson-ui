import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		{
			name: "workaround-injected-head-scripts",
			resolveId(id) {
				if (id === "tanstack-start-injected-head-scripts:v") {
					return `\0${id}`;
				}
			},
			load(id) {
				if (id === "\0tanstack-start-injected-head-scripts:v") {
					return 'export const injectedHeadScripts = ""';
				}
			},
		},
		tanstackStart(),
		nitro({
			preset: "aws-amplify",
			rollupConfig: { external: [/^@sentry\//] },
		}),
		devtools(),
		tailwindcss(),
		viteReact(),
	],
});
export default config;
