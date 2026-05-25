import { createFileRoute } from '@tanstack/react-router'
import { ConversationButton } from '@/components/conversation-button'
import { LoaderComponent } from '@/components/loader'
import { useAgentContext } from '@/context/agent-context'

export const Route = createFileRoute('/dashboard/agents/$agent/preview')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useAgentContext()
	return (
		<div className='mb-10 flex h-[40vh] w-full items-center justify-center py-10'>
			{agent.isLoading && <LoaderComponent className='h-[50vh]' />}
			{agent.data && <ConversationButton agentId={agent.data.agentId} />}
		</div>
	)
}
