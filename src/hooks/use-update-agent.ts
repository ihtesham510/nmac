import { useElevenLabsClient } from '@/api/client'
import { useMutation } from '@tanstack/react-query'
import type { ConversationalConfig } from '@elevenlabs/elevenlabs-js/api'

export function useUpdateAgent(agentId: string) {
	const client = useElevenLabsClient()
	return useMutation({
		mutationKey: ['update_agent'],
		mutationFn: async (conversation_config: ConversationalConfig) => {
			const res = await client.conversationalAi.agents.update(agentId, {
				conversationConfig: conversation_config,
			})
			return res
		},
	})
}
