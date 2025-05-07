import { useConversation } from '@11labs/react'
import { useState } from 'react'
import { BotButton } from './bot-button'

export function ConversationButton(props: { agentId: string }) {
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
