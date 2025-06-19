import { VoiceForm } from '@/components/agent-config/voice-settings-form'
import { VoiceFormSkeleton } from '@/components/voice-skeleton'
import { useAgentContext } from '@/context/agent-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents/$agent/voice')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent, isLoading } = useAgentContext()
	return (
		<div>
			{isLoading ? (
				<VoiceFormSkeleton />
			) : (
				<VoiceForm
					conversation_config={agent.data!.conversationConfig}
					agent_id={agent.data!.agentId}
				/>
			)}
		</div>
	)
}
