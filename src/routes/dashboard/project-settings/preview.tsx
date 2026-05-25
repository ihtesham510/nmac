import { createFileRoute } from '@tanstack/react-router'
import { ConversationButton } from '@/components/conversation-button'
import { LoaderComponent } from '@/components/loader'
import { useProjetSettings } from '@/context/project-setting-context'

export const Route = createFileRoute('/dashboard/project-settings/preview')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	return (
		<div className='flex h-[50vh] w-full items-center justify-center'>
			{agent.isLoading && <LoaderComponent className='h-[50vh]' />}
			{agent.data && <ConversationButton agentId={agent.data.agentId} />}
		</div>
	)
}
