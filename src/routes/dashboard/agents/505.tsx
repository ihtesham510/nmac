import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents/505')({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>505 server error</div>
}
