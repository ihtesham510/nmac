import { ConversationButton } from '@/components/conversation-button'
import { useProjetSettings } from '@/context/project-setting-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/project-settings/preview')({
	component: RouteComponent,
})

function RouteComponent() {
	const { selectedAgent } = useProjetSettings()
	return (
		<div className='h-[50vh] w-full flex justify-center items-center'>
			{selectedAgent && <ConversationButton agentId={selectedAgent.agentId} />}
		</div>
	)
}
