import { useProjetSettings } from '@/context/project-setting-context'
import { createFileRoute } from '@tanstack/react-router'
import { LoaderComponent } from '@/components/loader'
import { VoiceForm } from '@/components/agent-config/voice-settings-form'

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
