import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

const cacheDir = process.env.NODE_ENV === "development-docker" ? "/app/node_modules/.vite" : "node_modules/.vite";

export default defineConfig({
	server: {
		host: true,
		port: process.env.PORT || 5050
	},
	cacheDir,
	build: {
		outDir: "build"
	},
	loader: {
		".js": "jsx"
	}
});
