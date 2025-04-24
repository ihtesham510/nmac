import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigpaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ autoCodeSplitting: true }),
		viteReact(),
		tailwindcss(),
		tsconfigpaths(),
	],
	test: {
		globals: true,
		environment: 'jsdom',
	},
	server: {
		allowedHosts: true,
	},
})
