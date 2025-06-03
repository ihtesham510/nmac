import { UpdateAgentSettingsForm } from '@/components/agent-config/update-agent-settings-form'
import { UpdateAgentSettingsFormSkeleton } from '@/components/agent-skeleton'
import { useAgentContext } from '@/context/agent-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents/$agent/agent')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent, isLoading } = useAgentContext()
	return (
		<div>
			{isLoading ? (
				<UpdateAgentSettingsFormSkeleton />
			) : (
				<UpdateAgentSettingsForm data={agent.data!} key={agent.dataUpdatedAt} />
			)}
		</div>
	)
}
