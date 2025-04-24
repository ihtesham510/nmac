import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/clients/$client')({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/dashboard/client/$client"!</div>
}
