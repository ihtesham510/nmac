import { queries } from '@/api/query-options'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/agents/$agent_id')({
	component: RouteComponent,
	loader: async ({ params, context: { queryClient } }) => {
		await queryClient.prefetchQuery(queries.get_agent(params.agent_id))
	},
	notFoundComponent: () => {
		return <div>not found</div>
	},
	pendingComponent: () => (
		<div className='h-screen w-full flex justify-center items-center'>
			<LoaderCircle className='size-8 animate-spin' />
		</div>
	),
})

function RouteComponent() {
	const { agent_id } = Route.useParams()
	const { data, isLoading } = useQuery(queries.get_agent(agent_id))
	return (
		<div>
			{isLoading && <div>loading..................</div>}
			{data && !isLoading && <pre>{JSON.stringify(data, null, 2)}</pre>}
		</div>
	)
}
