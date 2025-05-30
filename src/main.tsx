import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './index.css'
import reportWebVitals from './reportWebVitals.ts'
import { Toaster } from 'sonner'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/context/auth-context.tsx'
import { ConvexQueryCacheProvider } from './cache/provider.tsx'

declare global {
	interface Array<T> {
		equals(arr2: T[]): boolean
	}
	interface String {
		capitalize(): string
	}
}

String.prototype.capitalize = function (): string {
	return this.charAt(0).toUpperCase() + this.slice(1)
}
Array.prototype.equals = function (arr2) {
	return (
		this.length === arr2.length &&
		this.every((value, index) => value === arr2[index])
	)
}

document.documentElement.classList.add('dark')

const convexURL = import.meta.env.VITE_CONVEX_URL
if (!convexURL) {
	throw new Error(
		'VITE_CONVEX_URL is not present, add the url in you .env.local file.',
	)
}

const convexReactClient = new ConvexReactClient(convexURL)

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
		},
	},
})

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: undefined!,
	},
	defaultPreload: 'intent',
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

function App() {
	const auth = useAuth()
	return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<Toaster />
			<ConvexProvider client={convexReactClient}>
				<ConvexQueryCacheProvider>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<App />
						</AuthProvider>
					</QueryClientProvider>
				</ConvexQueryCacheProvider>
			</ConvexProvider>
		</StrictMode>,
	)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
