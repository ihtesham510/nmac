import { queries } from '@/api/query-options'
import { LoaderComponent } from '@/components/loader'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents')({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.prefetchQuery(queries.list_agents())
	},
	pendingComponent: LoaderComponent,
})

function RouteComponent() {
	return (
		<>
			<Outlet />
		</>
	)
}
