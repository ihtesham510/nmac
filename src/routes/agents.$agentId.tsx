import { useQuery } from '@/cache/useQuery'
import { useConversation } from '@11labs/react'
import { BotButton } from '@/components/bot-button'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useState } from 'react'
import { LoaderCircle, TriangleAlert } from 'lucide-react'

export const Route = createFileRoute('/agents/$agentId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agentId } = Route.useParams()
	const id: Id<'agent'> = agentId as Id<'agent'>
	const agent = useQuery(api.agents.getAgent, { agentId: id })
	return (
		<div className='w-full h-screen flex justify-center items-center'>
			{typeof agent === 'undefined' && (
				<LoaderCircle className='size-8 animate-spin' />
			)}
			{agent && <ConversationButton agentId={agent.agentId} />}
			{agent === null && (
				<div className='flex gap-2 justify-center items-center'>
					<TriangleAlert className='size-4' />
					<p className='text-semibold'>Invalid Link</p>
				</div>
			)}
		</div>
	)
}

function ConversationButton(props: { agentId: string }) {
	const [conversationStarted, setConversationStarted] = useState<boolean>(false)
	const [errorConversation, setErrorConversation] = useState<boolean>(false)
	const conversation = useConversation({ agentId: props.agentId })
	const handleConversation = async () => {
		if (conversationStarted) {
			await conversation.endSession()
			setConversationStarted(false)
			return
		} else {
			try {
				await navigator.mediaDevices.getUserMedia({ audio: true })
			} catch (err) {
				console.log('error while accessing microphone', err)
			}
			try {
				await conversation.startSession()
				setConversationStarted(true)
				return
			} catch (err) {
				setErrorConversation(true)
				console.error('Error while starting conversation', err)
				return
			}
		}
	}

	return (
		<BotButton
			variant={
				errorConversation || (!conversation.isSpeaking && conversationStarted)
					? 'destructive'
					: conversationStarted
						? 'live'
						: 'default'
			}
			onClick={handleConversation}
		/>
	)
}
