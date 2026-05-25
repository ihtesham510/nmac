import { createFileRoute } from '@tanstack/react-router'
import { VoiceForm } from '@/components/agent-config/voice-settings-form'
import { LoaderComponent } from '@/components/loader'
import { useProjetSettings } from '@/context/project-setting-context'

export const Route = createFileRoute('/dashboard/project-settings/voice')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	return (
		<div>
			{agent.isLoading && <LoaderComponent className='h-[50vh]' />}
			{agent.data && !agent.isLoading && (
				<VoiceForm
					conversation_config={agent.data.conversationConfig}
					agent_id={agent.data.agentId}
				/>
			)}
		</div>
	)
}
