import { ConversationButton } from '@/components/conversation-button'
import { LoaderComponent } from '@/components/loader'
import { useProjetSettings } from '@/context/project-setting-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/project-settings/preview')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	return (
		<div className='h-[50vh] w-full flex justify-center items-center'>
			{agent.isLoading && <LoaderComponent className='h-[50vh]' />}
			{agent.data && <ConversationButton agentId={agent.data.agent_id} />}
		</div>
	)
}
