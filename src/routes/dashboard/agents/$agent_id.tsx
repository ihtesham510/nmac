import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents/$agent_id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent_id } = Route.useParams()
	const client = useElevenLabsClient()
	const { data, isLoading } = useQuery(
		queries.get_agent(client, { id: agent_id, enabled: true }),
	)
	return (
		<div>
			{isLoading && <div>loading..................</div>}
			{data && !isLoading && <pre>{JSON.stringify(data, null, 2)}</pre>}
		</div>
	)
}
