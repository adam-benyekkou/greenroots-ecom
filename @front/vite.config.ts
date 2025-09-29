import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [reactRouter(), tsconfigPaths()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
			},
		},
	},
	/*
	resolve: {
		alias: {
			'@': '/src'
		}
	}
	*/
});
