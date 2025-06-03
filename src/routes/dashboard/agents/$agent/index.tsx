import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents/$agent/')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = Route.useParams()
	return <Navigate to='/dashboard/agents/$agent/agent' params={{ agent }} />
}
