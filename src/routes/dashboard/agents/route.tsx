import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents')({
	component: RouteComponent,
	beforeLoad(ctx) {
		const user = ctx.context.auth.user.data
		const isLoading = ctx.context.auth.user.isLoading
		if (!user && !isLoading) throw redirect({ to: '/dashboard/505' })
	},
})

function RouteComponent() {
	return (
		<>
			<Outlet />
		</>
	)
}
