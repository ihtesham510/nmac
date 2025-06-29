import Pricing from '@/components/pricing'
import { createFileRoute } from '@tanstack/react-router'

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
