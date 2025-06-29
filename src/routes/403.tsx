import { UnProtectedRoute } from '@/hoc/unprotected-route'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/403')({
	component: () => (
		<UnProtectedRoute>
			{' '}
			<RouteComponent />
		</UnProtectedRoute>
	),
})

function RouteComponent() {
	return <div>Hello "/403"!</div>
}
