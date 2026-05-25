import { createFileRoute } from '@tanstack/react-router'
import Pricing from '@/components/pricing'

export const Route = createFileRoute('/pricing')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<Pricing />
		</div>
	)
}
