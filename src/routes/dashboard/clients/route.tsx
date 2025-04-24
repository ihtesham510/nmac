import { queries } from '@/api/query-options'
import { LoaderComponent } from '@/components/loader'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/clients')({
	component: RouteComponent,
	async loader({ context: { queryClient, auth } }) {
		const user = auth.user.data
		if (user && !auth.user.isLoading) {
			await queryClient.prefetchQuery(queries.get_clients(user._id))
		}
	},
	pendingComponent: LoaderComponent,
})

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	)
}
