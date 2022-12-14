import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	server: {
		port: process.env.PORT || 5050
	},
	build: {
		outDir: "build"
	},
	loader: {
		".js": "jsx"
	}
});
