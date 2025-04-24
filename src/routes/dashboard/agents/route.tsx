import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<Outlet />
		</>
	)
}
