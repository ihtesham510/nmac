import { ConversationButton } from '@/components/conversation-button'
import { LoaderComponent } from '@/components/loader'
import { useAgentContext } from '@/context/agent-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/agents/$agent/preview')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useAgentContext()
	return (
		<div className='flex justify-center w-full h-[40vh] py-10 mb-10 items-center'>
			{agent.isLoading && <LoaderComponent className='h-[50vh]' />}
			{agent.data && <ConversationButton agentId={agent.data.agent_id} />}
		</div>
	)
}
