import { ProtectedUserRoute } from '@/hoc/protected-user-route'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents')({
	component: () => (
		<ProtectedUserRoute>
			<RouteComponent />
		</ProtectedUserRoute>
	),
})

function RouteComponent() {
	return (
		<>
			<Outlet />
		</>
	)
}
