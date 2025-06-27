import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProtectedUserRoute } from '@/hoc/protected-user-route'

export const Route = createFileRoute('/dashboard/clients')({
	component: () => (
		<ProtectedUserRoute>
			<RouteComponent />
		</ProtectedUserRoute>
	),
})

function RouteComponent() {
	return <Outlet />
}
