import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/clients')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	)
}
