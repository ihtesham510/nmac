import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { Auth } from '@/context/auth-context'

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
	auth: Auth
}>()({
	component: () => (
		<>
			<Outlet />
			<ReactQueryDevtools />
			<TanStackRouterDevtools />
		</>
	),
})
