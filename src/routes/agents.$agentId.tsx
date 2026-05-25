import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { LoaderCircle, TriangleAlert } from 'lucide-react'
import { useQuery } from '@/cache/useQuery'
import { ConversationButton } from '@/components/conversation-button'

export const Route = createFileRoute('/agents/$agentId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agentId } = Route.useParams()
	const id: Id<'agent'> = agentId as Id<'agent'>
	const agent = useQuery(api.agents.getAgent, { agentId: id })
	return (
		<div className='flex h-screen w-full items-center justify-center'>
			{typeof agent === 'undefined' && (
				<LoaderCircle className='size-8 animate-spin' />
			)}
			{agent && <ConversationButton agentId={agent.agentId} />}
			{agent === null && (
				<div className='flex items-center justify-center gap-2'>
					<TriangleAlert className='size-4' />
					<p className='text-semibold'>Invalid Link</p>
				</div>
			)}
		</div>
	)
}
