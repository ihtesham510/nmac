import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/404')({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/dashboard/404"!</div>
}
