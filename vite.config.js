import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigpaths from 'vite-tsconfig-paths'
import vitePluginProxy from '@open-xchange/vite-plugin-proxy'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		define: {
			'process.env': env,
		},
		test: {
			globals: true,
			environment: 'jsdom',
		},
		server: {
			allowedHosts: true,
		},
		plugins: [
			vitePluginProxy({
				proxy: {
					'/webhook': {
						target: env.VITE_CONVEX_URL.trim()
							.replace(/\.cloud$/, '.site')
							.trim(),
						changeOrigin: true,
					},
				},
			}),
			TanStackRouterVite({ autoCodeSplitting: true }),
			viteReact(),
			tailwindcss(),
			tsconfigpaths(),
		],
	}
})
